import React from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./router";
import { ThemeProvider } from "../context/ThemeContext";
import { SSRDataProvider } from "../context/SSRDataContext";

function App({ initialData }: { initialData?: any }) {
    return (
        <SSRDataProvider initialData={initialData}>
            <ThemeProvider>
                <Routes>
                    {routes.map((r: any) => (
                        <Route key={r.path} path={r.path} element={<r.component />} />
                    ))}
                </Routes>
            </ThemeProvider>
        </SSRDataProvider>
    );
}
export default App;