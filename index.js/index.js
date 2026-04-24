const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

function isValid(entry) {
    entry = entry.trim();

    if (!/^[A-Z]->[A-Z]$/.test(entry)) {
        return false;
    }

    const [parent, child] = entry.split("->");

    if (parent === child) {
        return false;
    }

    return true;
}

app.post("/bfhl", (req, res) => {
    const data = req.body.data || [];

    let invalid_entries = [];
    let duplicate_edges = [];
    let validEdges = [];
    let seen = new Set();

    for (let item of data) {
        item = item.trim();

        if (!isValid(item)) {
            invalid_entries.push(item);
            continue;
        }

        if (seen.has(item)) {
            if (!duplicate_edges.includes(item)) {
                duplicate_edges.push(item);
            }
            continue;
        }

        seen.add(item);
        validEdges.push(item);
    }

    const response = {
        user_id: "R RAJ PRITHVI",
        email_id: "rr6120@srmist.edu.in",
        college_roll_number: "RA2311003020258",
        hierarchies: [],
        invalid_entries: invalid_entries,
        duplicate_edges: duplicate_edges,
        summary: {
            total_trees: validEdges.length,
            total_cycles: 0,
            largest_tree_root: validEdges.length ? validEdges[0][0] : ""
        }
    };

    res.json(response);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
