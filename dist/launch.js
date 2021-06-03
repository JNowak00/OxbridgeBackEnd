"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userRoutes_1 = require("./routes/userRoutes");
const port = 3000;
const server = userRoutes_1.endpoints.listen(port, () => {
    console.log('Running in this mode: ' + process.env.NODE_ENV);
    console.log('This server is listening at port:' + port + 'ip: ');
});
//# sourceMappingURL=launch.js.map