"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = require("./router/router");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, 'client/build')));
app.use((0, cors_1.default)());
app.use(router_1.quizRouter);
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'client/build/index.html'));
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("listening on port " + PORT);
});
//# sourceMappingURL=index.js.map