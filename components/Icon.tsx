import React from 'react';
import {
	Home,
	NotebookText,
	List,
	Box,
	Car,
	Wallet,
	Fuel,
	BarChart3,
} from 'lucide-react';

/**
 * Компонент Icon обирає й відображає потрібну іконку.
 * Усі іконки спадкують колір тексту та можуть масштабуватися через клас.
 */
export function Icon({
	name,
	className,
}: {
	name:
		| 'home'
		| 'journal'
		| 'catalog'
		| 'parts'
		| 'vehicle'
		| 'expenses'
		| 'fuel'
		| 'reports';
	className?: string;
}) {
	const props = { className, size: 24 };
	switch (name) {
		case 'home':
			return <Home {...props} />;
		case 'journal':
			return <NotebookText {...props} />;
		case 'catalog':
			return <List {...props} />;
		case 'parts':
			return <Box {...props} />;
		case 'vehicle':
			return <Car {...props} />;
		case 'expenses':
			return <Wallet {...props} />;
		case 'fuel':
			return <Fuel {...props} />;
		case 'reports':
			return <BarChart3 {...props} />;
		default:
			return null;
	}
}