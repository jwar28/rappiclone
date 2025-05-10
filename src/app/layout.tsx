import { Geist } from "next/font/google";
import "./globals.css";
import { AuthRedirectGuard } from "../components/auth/auth-redirect-guard";
import { AuthProvider } from "../utils/auth-provider";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Rappiclone",
	description:
		"Rappiclon es una plataforma de gestión de clientes y pedidos para tu negocio.",
};

const geistSans = Geist({
	display: "swap",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={geistSans.className} suppressHydrationWarning>
			<AuthRedirectGuard />
			<body>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
