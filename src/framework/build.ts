import esbuild from "esbuild";

const isWatch = process.argv.includes("--watch");
const buildServer = process.env.BUILD_SERVER === 'true';

//client build
const clientContext = await esbuild.context({
    entryPoints: ["src/client.tsx"],
    bundle: true,
    format: "esm",
    outdir: "dist",  // Required for splitting (can't use outfile)
    splitting: true, 
    loader:{
        ".ts": "ts", 
        ".tsx": "tsx",
        ".woff": "file",
        ".woff2": "file",
    },
    minify: true,
    sourcemap: true,
});

if (isWatch) {
    await clientContext.watch();
    console.log(" Watching client files for changes...");
} else {
    await clientContext.rebuild();
    await clientContext.dispose();
}

// Only build server for production
if (buildServer) {
    await esbuild.build({
        entryPoints: ["src/framework/server.ts"],
        bundle: true,
        outfile:"dist/server.js",
        platform: "node",
        sourcemap: true,
        format: "esm",
        target: ["node20"],
        loader:{".ts": "ts", ".js": "js"},
        external: ["react", "react-dom", "express"],
    }).catch(() => process.exit(1));
    console.log(" Server built for production");
}