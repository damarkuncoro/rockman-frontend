"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogin, LoginRequest } from "@/hooks/api/v2/login/post.login";

/**
 * Halaman Login
 * Menampilkan form login dengan email dan password
 */
export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useLogin();
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  /**
   * Memeriksa token di localStorage saat komponen dimuat
   * Jika token ada, redirect ke dashboard
   */
  useEffect(() => {
    // Pastikan kode berjalan di browser, bukan server
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      console.log("Token di localStorage:", token ? "Ditemukan" : "Tidak ada");
      
      if (token) {
        console.log("Token ditemukan, redirect ke dashboard");
        router.push("/dashboard");
      }
    }
  }, [router]);

  /**
   * Menangani perubahan input form
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Menangani submit form login
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const result = await login(credentials);
      console.log("Login result:", result);

      if (result?.data?.token) {
        // Redirect ke dashboard setelah login berhasil
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Login gagal. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Rockman</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-700">Login</h2>
        </div>

        {errorMessage && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Email Anda"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Password Anda"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            >
              {loading ? "Sedang Masuk..." : "Masuk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}