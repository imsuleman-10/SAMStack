const fs = require("fs-extra");
const path = require("path");

const root = path.resolve(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");

async function copy() {
  try {
    // Copy public folder into standalone
    const publicDest = path.join(standalone, "public");
    await fs.copy(path.join(root, "public"), publicDest);
    console.log("✓ Copied public/ to standalone");

    // Copy .next/static into standalone/.next/static
    const staticSrc = path.join(root, ".next", "static");
    const staticDest = path.join(standalone, ".next", "static");
    await fs.copy(staticSrc, staticDest);
    console.log("✓ Copied .next/static/ to standalone");

    console.log("\n✓ Standalone build ready for electron-builder");
  } catch (err) {
    console.error("✗ Copy failed:", err);
    process.exit(1);
  }
}

copy();
