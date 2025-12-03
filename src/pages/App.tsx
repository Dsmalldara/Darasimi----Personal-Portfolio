import React from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./router";
import { ThemeProvider } from "../context/ThemeContext";

function App() {
    return (
        <ThemeProvider>
            <Routes>
                {routes.map((r: any) => (
                    <Route key={r.path} path={r.path} element={<r.component />} />
                ))}
            </Routes>
        </ThemeProvider>
    );
}
export default App;