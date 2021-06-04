"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("./controllers/user.controller");
const port = 3000;
const server = user_controller_1.app.listen(port, () => {
    console.log('Running in this mode: ' + process.env.NODE_ENV);
    console.log('This server is listening at port:' + port + 'ip: ');
});
//# sourceMappingURL=launch.js.map