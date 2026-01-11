'use client';
import { useState } from 'react';
import NavbarVertical from '@/layouts/navbars/NavbarVertical';
import NavbarTop from '@/layouts/navbars/NavbarTop';

export default function DashboardWrapper({
	children,
}: {
	children: React.ReactNode
}) {
	const [showMenu, setShowMenu] = useState(true);

	return (
		<div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
			<div className="navbar-vertical navbar">
				<NavbarVertical
					showMenu={showMenu}
					onClick={(value: boolean) => setShowMenu(value)}
				/>
			</div>
			<div id="page-content">
				<div className="header">
					<NavbarTop
						showMenu={showMenu}
						onToggleSidebarMenu={(value: boolean) => setShowMenu(value)}
					/>
				</div>
				{children}
			</div>
		</div>
	);
}