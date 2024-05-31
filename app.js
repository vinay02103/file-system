// Import required modules
const http = require("http");
const fs = require("fs");
const path = require("path");

// Define the port to listen on
const PORT = 3000;

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Parse the URL to get the pathname and query parameters
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const filename = path.join(__dirname, pathname);

  // Set headers
  res.setHeader("Content-Type", "text/plain");

  // Handle different HTTP methods
  switch (req.method) {
    case "GET":
      // Read file content
      fs.readFile(filename, "utf8", (err, data) => {
        if (err) {
          if (err.code === "ENOENT") {
            res.statusCode = 404;
            res.end("File not found");
          } else {
            res.statusCode = 500;
            res.end("Internal Server Error");
          }
        } else {
          res.statusCode = 200;
          res.end(data);
        }
      });
      break;

    case "POST":
      // Create or overwrite a file
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        fs.writeFile(filename, body, (err) => {
          if (err) {
            res.statusCode = 500;
            res.end("Internal Server Error");
          } else {
            res.statusCode = 201;
            res.end("File created/updated successfully");
          }
        });
      });
      break;

    case "DELETE":
      // Delete a file
      fs.unlink(filename, (err) => {
        if (err) {
          if (err.code === "ENOENT") {
            res.statusCode = 404;
            res.end("File not found");
          } else {
            res.statusCode = 500;
            res.end("Internal Server Error");
          }
        } else {
          res.statusCode = 200;
          res.end("File deleted successfully");
        }
      });
      break;

    default:
      res.statusCode = 405;
      res.end("Method not allowed");
      break;
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
