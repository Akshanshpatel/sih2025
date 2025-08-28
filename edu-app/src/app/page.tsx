"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignedIn, SignedOut, SignInButton, useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

export default function Home() {
	const router = useRouter();
	const { isSignedIn, user } = useUser();

	useEffect(() => {
		if (!isSignedIn) return;
		const type = (user?.publicMetadata as any)?.userType as "student" | "teacher" | undefined;
		if (type === "student") router.replace("/dashboard/student");
		else if (type === "teacher") router.replace("/dashboard/teacher");
	}, [isSignedIn, user, router]);

	return (
		<div className="relative min-h-screen flex items-center justify-center p-8 overflow-hidden">
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.35),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.35),transparent_50%)]" />
			<div className="absolute inset-0 -z-10 opacity-30" style={{ backgroundImage: "url('/grid.svg')" }} />
			<div className="max-w-4xl w-full space-y-8 text-center">
				<h1 className="text-4xl font-extrabold tracking-tight">Pick your role</h1>
				<p className="text-gray-600 max-w-xl mx-auto">Select one to continue!</p>
				<div className="grid sm:grid-cols-2 gap-6">
					<RoleCard label="Individual (Student)" value="student" illustration="/student.svg" />
					<RoleCard label="Organization (Teacher)" value="teacher" illustration="/teacher.svg" />
				</div>
			</div>
		</div>
	);
}

function RoleButton({ label, value }: { label: string; value: "student" | "teacher" }) {
	const router = useRouter();
	const { isSignedIn, user } = useUser();

	const handleClick = async () => {
		if (!isSignedIn) return;
		await user?.update({ unsafeMetadata: { userType: value } });
		router.push(value === "student" ? "/dashboard/student" : "/dashboard/teacher");
	};

	return (
		<>
			<SignedOut>
				<SignInButton mode="modal">
					<button className="px-4 py-2 rounded bg-black text-white">{label}</button>
				</SignInButton>
			</SignedOut>
			<SignedIn>
				<button onClick={handleClick} className="px-4 py-2 rounded bg-black text-white">
					{label}
				</button>
			</SignedIn>
		</>
	);
}

function RoleCard({ label, value, illustration }: { label: string; value: "student" | "teacher"; illustration: string }) {
	const router = useRouter();
	const { isSignedIn, user } = useUser();
	const { openSignIn } = useClerk();
	const onClick = async () => {
		if (!isSignedIn) {
			openSignIn();
			return;
		}
		await user?.update({ unsafeMetadata: { userType: value } });
		router.push(value === "student" ? "/dashboard/student" : "/dashboard/teacher");
	};
	return (
		<motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={onClick} className="group p-6 rounded-2xl border border-white/20 bg-white/60 dark:bg-black/40 backdrop-blur shadow-xl text-center">
			<div className="flex flex-col items-center gap-3">
				<div className="relative w-28 h-28">
					<Image src={illustration} alt={label} fill className="rounded-full object-cover shadow-sm group-hover:shadow-xl group-hover:scale-[1.03] transition-all" />
				</div>
				<div className="text-lg font-semibold">{label}</div>
				<div className="text-sm text-gray-600"></div>
			</div>
		</motion.button>
	);
}
