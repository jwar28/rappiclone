"use client";

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
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/src/components/ui/select";
import { type UserRole, signUp } from "@/src/utils/supabase/client";
import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState<UserRole>("customer");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess(false);

		const { success, error } = await signUp(email, password, role);

		if (success) {
			setSuccess(true);
			setEmail("");
			setPassword("");
			setRole("customer");
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
							<CardTitle className="text-2xl font-bold text-center">
								Crear una cuenta
							</CardTitle>
							<CardDescription className="text-center">
								Ingresa tus datos para registrarte
							</CardDescription>
						</CardHeader>

						<form onSubmit={handleSubmit}>
							<CardContent className="space-y-4">
								{error && (
									<Alert variant="destructive">
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}

								{success && (
									<Alert>
										<AlertDescription>
											Registro exitoso. Por favor, verifica tu correo
											electrónico para confirmar tu cuenta.
										</AlertDescription>
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

								<div className="space-y-2">
									<Label htmlFor="role">Tipo de cuenta</Label>
									<Select
										value={role}
										onValueChange={(value) => setRole(value as UserRole)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecciona un tipo de cuenta" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="customer">Cliente</SelectItem>
											<SelectItem value="business_owner">
												Dueño de negocio
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>

							<CardFooter className="flex flex-col space-y-4">
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? "Cargando..." : "Registrarse"}
								</Button>

								<div className="text-center text-sm">
									¿Ya tienes una cuenta?{" "}
									<Link
										href="/signin"
										className="font-medium text-primary hover:underline"
									>
										Inicia sesión
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
