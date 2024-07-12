/** @type {import('next').NextConfig} */

const nextConfig = {
	images: {
		domains: ["picsum.photos"],
	},
	sassOptions: {
		outputStyle: "compressed",
	},
};

export default nextConfig;
