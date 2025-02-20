const express = require("express");
const path = require("path");
const collegeData = require("./collegeData"); // Import your collegeData module
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Middleware to serve static files (for views)
app.use(express.static(path.join(__dirname, "views")));

// Initialize college data
collegeData.initialize()
    .then(() => {
        // Setup routes
        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "home.html"));
        });

        app.get("/about", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "about.html"));
        });

        app.get("/htmlDemo", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
        });

        app.get("/students", (req, res) => {
            const course = req.query.course;
            if (course) {
                collegeData.getStudentsByCourse(course)
                    .then(students => students.length 
                        ? res.json(students) 
                        : res.status(404).json({ message: "no results" }))
                    .catch(() => res.status(500).json({ message: "Internal Server Error" }));
            } else {
                collegeData.getAllStudents()
                    .then(students => students.length 
                        ? res.json(students) 
                        : res.status(404).json({ message: "no results" }))
                    .catch(() => res.status(500).json({ message: "Internal Server Error" }));
            }
        });

        app.get("/tas", (req, res) => {
            collegeData.getTAs()
                .then(tas => tas.length 
                    ? res.json(tas) 
                    : res.status(404).json({ message: "no results" }))
                .catch(() => res.status(500).json({ message: "Internal Server Error" }));
        });

        app.get("/courses", (req, res) => {
            collegeData.getCourses()
                .then(courses => courses.length 
                    ? res.json(courses) 
                    : res.status(404).json({ message: "no results" }))
                .catch(() => res.status(500).json({ message: "Internal Server Error" }));
        });

        app.get("/student/:num", (req, res) => {
            const studentNum = req.params.num;
            collegeData.getStudentByNum(studentNum)
                .then(student => student 
                    ? res.json(student) 
                    : res.status(404).json({ message: "no results" }))
                .catch(() => res.status(500).json({ message: "Internal Server Error" }));
        });

        // Handle 404 for unmatched routes
        app.use((req, res) => {
            res.status(404).send("Page Not Found");
        });

        // Start the server
        app.listen(HTTP_PORT, () => {
            console.log("server listening on port: " + HTTP_PORT);
        });
    })
    .catch(err => {
        console.error("Failed to initialize data: ", err);
    });
