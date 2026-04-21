import { InnerBlocks } from "@wordpress/block-editor";

// Only preserve the InnerBlocks content for server-side rendering.
// render.php handles the full outer markup.
export default function save() {
	return <InnerBlocks.Content />;
}
