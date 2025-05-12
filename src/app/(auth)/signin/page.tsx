"use client";

import { loadBusinessOwnerData } from "@/src/api/load-business-owner-data";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/src/components/ui/card";
import FadeContent from "@/src/components/ui/fade-content";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useAuthStore } from "@/src/stores/auth-store";
import { signIn } from "@/src/utils/supabase/client";
import Link from "next/link";
import { useState } from "react";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const { refreshUser, user } = useAuthStore();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const { success, error } = await signIn(email, password);

		if (success) {
			await refreshUser();
			window.location.href = "/";
		} else if (error) {
			setError(error);
		}

		setLoading(false);
	};

	return (
		<>
			<FadeContent easing="ease-in-out">
				<div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
					<Card className="w-full max-w-md">
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl font-bold text-center">Iniciar sesión</CardTitle>
							<CardDescription className="text-center">
								Ingresa tus credenciales para acceder
							</CardDescription>
						</CardHeader>

						<form onSubmit={handleSubmit}>
							<CardContent className="space-y-4">
								{error && (
									<Alert variant="destructive">
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}

								<div className="space-y-2">
									<Label htmlFor="email">Correo electrónico</Label>
									<Input
										id="email"
										type="email"
										placeholder="correo@ejemplo.com"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="password">Contraseña</Label>
									<Input
										id="password"
										type="password"
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
							</CardContent>

							<CardFooter className="flex flex-col space-y-4">
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? "Cargando..." : "Iniciar sesión"}
								</Button>

								<div className="text-center text-sm">
									¿No tienes una cuenta?{" "}
									<Link href="/signup" className="font-medium text-primary hover:underline">
										Regístrate
									</Link>
								</div>
							</CardFooter>
						</form>
					</Card>
				</div>
			</FadeContent>
		</>
	);
}
