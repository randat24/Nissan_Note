"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Search, Zap, AlertTriangle, Info, ChevronRight,
	MapPin, HelpCircle, Eye, CheckCircle, XCircle,
	Wrench, Navigation2, Camera
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Enhanced fuse data with exact positions
interface FusePosition {
	id: string;
	position: string;
	row: number;
	col: number;
	amperage: number;
	color: string;
	circuits: string[];
	relatedFuses?: string[]; // Связанные предохранители
	testPoints?: string[];   // Точки проверки
}

interface CircuitGroup {
	name: string;
	icon: string;
	fuses: string[];
	description: string;
	troubleshooting: string[];
}

// Visual layout for engine compartment fusebox
const ENGINE_FUSEBOX_LAYOUT: FusePosition[][] = [
	// Row 1
	[
		{ id: 'ef1', position: 'F1', row: 1, col: 1, amperage: 40, color: 'orange', circuits: ['ABS'], relatedFuses: ['cf12'] },
		{ id: 'ef2', position: 'F2', row: 1, col: 2, amperage: 30, color: 'green', circuits: ['Вентилятор'], relatedFuses: ['R5'] },
		{ id: 'ef3', position: 'F3', row: 1, col: 3, amperage: 30, color: 'green', circuits: ['Стартер'], relatedFuses: ['R2'] },
		{ id: 'ef4', position: 'F4', row: 1, col: 4, amperage: 20, color: 'yellow', circuits: ['Фары ближний'] },
	],
	// Row 2
	[
		{ id: 'ef5', position: 'F5', row: 2, col: 1, amperage: 10, color: 'red', circuits: ['Дальний левый'] },
		{ id: 'ef6', position: 'F6', row: 2, col: 2, amperage: 10, color: 'red', circuits: ['Дальний правый'] },
		{ id: 'ef7', position: 'F7', row: 2, col: 3, amperage: 15, color: 'blue', circuits: ['Сигнал'] },
		{ id: 'ef8', position: 'F8', row: 2, col: 4, amperage: 20, color: 'yellow', circuits: ['Топливный насос'], relatedFuses: ['R3'] },
	],
	// Row 3 - Relays
	[
		{ id: 'r1', position: 'R1', row: 3, col: 1, amperage: 0, color: 'black', circuits: ['Главное реле'] },
		{ id: 'r2', position: 'R2', row: 3, col: 2, amperage: 0, color: 'black', circuits: ['Реле стартера'], relatedFuses: ['ef3'] },
		{ id: 'r3', position: 'R3', row: 3, col: 3, amperage: 0, color: 'black', circuits: ['Реле бензонасоса'], relatedFuses: ['ef8'] },
		{ id: 'r4', position: 'R4', row: 3, col: 4, amperage: 0, color: 'black', circuits: ['Реле кондиционера'] },
	]
];

// Visual layout for cabin fusebox
const CABIN_FUSEBOX_LAYOUT: FusePosition[][] = [
	// Left column
	[
		{ id: 'cf1', position: 'F1', row: 1, col: 1, amperage: 10, color: 'red', circuits: ['Приборная панель'] },
		{ id: 'cf2', position: 'F2', row: 2, col: 1, amperage: 15, color: 'blue', circuits: ['Прикуриватель', 'Розетка 12В'], relatedFuses: [] },
		{ id: 'cf3', position: 'F3', row: 3, col: 1, amperage: 10, color: 'red', circuits: ['Габариты левые'] },
		{ id: 'cf4', position: 'F4', row: 4, col: 1, amperage: 10, color: 'red', circuits: ['Габариты правые'] },
	],
	// Middle column
	[
		{ id: 'cf5', position: 'F5', row: 1, col: 2, amperage: 20, color: 'yellow', circuits: ['Дворники передние'] },
		{ id: 'cf6', position: 'F6', row: 2, col: 2, amperage: 15, color: 'blue', circuits: ['Дворник задний'] },
		{ id: 'cf7', position: 'F7', row: 3, col: 2, amperage: 30, color: 'green', circuits: ['Стеклоподъемники'] },
		{ id: 'cf8', position: 'F8', row: 4, col: 2, amperage: 10, color: 'red', circuits: ['Поворотники'] },
	],
	// Right column
	[
		{ id: 'cf9', position: 'F9', row: 1, col: 3, amperage: 15, color: 'blue', circuits: ['Магнитола'] },
		{ id: 'cf10', position: 'F10', row: 2, col: 3, amperage: 10, color: 'red', circuits: ['Стоп-сигналы'] },
		{ id: 'cf11', position: 'F11', row: 3, col: 3, amperage: 25, color: 'white', circuits: ['Обогрев стекла'] },
		{ id: 'cf12', position: 'F12', row: 4, col: 3, amperage: 10, color: 'red', circuits: ['Подушки SRS'], relatedFuses: ['ef1'] },
	],
	// Bottom row
	[
		{ id: 'cf13', position: 'F13', row: 5, col: 1, amperage: 20, color: 'yellow', circuits: ['Центральный замок'] },
		{ id: 'cf14', position: 'F14', row: 5, col: 2, amperage: 30, color: 'green', circuits: ['Кондиционер'], relatedFuses: ['r4'] },
		{ id: 'cf15', position: 'F15', row: 5, col: 3, amperage: 15, color: 'blue', circuits: ['Подогрев сидений'] },
		{ id: 'cf16', position: 'F16', row: 5, col: 4, amperage: 10, color: 'red', circuits: ['Зеркала'] },
	]
];

// Circuit groups for related systems
const CIRCUIT_GROUPS: CircuitGroup[] = [
	{
		name: 'Система освещения',
		icon: '💡',
		fuses: ['ef4', 'ef5', 'ef6', 'cf3', 'cf4', 'cf10'],
		description: 'Все световые приборы автомобиля',
		troubleshooting: [
			'Проверить лампы на перегорание',
			'Проверить массу фар',
			'Проверить переключатель света'
		]
	},
	{
		name: 'Система запуска',
		icon: '🔑',
		fuses: ['ef3', 'ef8', 'r1', 'r2', 'r3'],
		description: 'Стартер, топливный насос, главное реле',
		troubleshooting: [
			'Проверить заряд АКБ (>12.4V)',
			'Проверить клеммы на окисление',
			'Слушать работу бензонасоса при включении зажигания'
		]
	},
	{
		name: 'Климат-контроль',
		icon: '❄️',
		fuses: ['cf14', 'cf11', 'cf15', 'cf16', 'r4'],
		description: 'Кондиционер, обогрев стекол и сидений',
		troubleshooting: [
			'Проверить уровень фреона',
			'Проверить работу компрессора',
			'Проверить вентилятор печки'
		]
	},
	{
		name: 'Мультимедиа и розетки',
		icon: '🔊',
		fuses: ['cf9', 'cf2'],
		description: 'Магнитола, прикуриватель, розетки 12В',
		troubleshooting: [
			'Проверить подключение магнитолы',
			'Проверить постоянное питание (+12V)',
			'Очистить контакты прикуривателя'
		]
	},
	{
		name: 'Безопасность',
		icon: '🛡️',
		fuses: ['ef1', 'cf12', 'cf8', 'cf10'],
		description: 'ABS, подушки безопасности, сигналы',
		troubleshooting: [
			'Считать коды ошибок сканером',
			'Проверить датчики ABS на колесах',
			'Проверить спираль подушки в руле'
		]
	}
];

const FUSE_COLORS = {
	red: { amp: 10, hex: '#ef4444' },
	blue: { amp: 15, hex: '#3b82f6' },
	yellow: { amp: 20, hex: '#eab308' },
	white: { amp: 25, hex: '#e5e7eb' },
	green: { amp: 30, hex: '#22c55e' },
	orange: { amp: 40, hex: '#f97316' },
	black: { amp: 0, hex: '#1f2937' } // For relays
};

// Troubleshooting wizard steps
interface WizardStep {
	id: number;
	question: string;
	options: {
		label: string;
		nextStep?: number;
		result?: string;
		fusesToCheck?: string[];
	}[];
}

const TROUBLESHOOTING_WIZARD: WizardStep[] = [
	{
		id: 1,
		question: 'Какая система не работает?',
		options: [
			{ label: 'Двигатель не заводится', nextStep: 2 },
			{ label: 'Не работает свет', nextStep: 3 },
			{ label: 'Проблемы с климатом', nextStep: 4 },
			{ label: 'Электрика салона', nextStep: 5 },
			{ label: 'Другое', nextStep: 6 }
		]
	},
	{
		id: 2,
		question: 'Что происходит при повороте ключа?',
		options: [
			{ label: 'Тишина', result: 'Проверьте АКБ и предохранители', fusesToCheck: ['ef3', 'r1', 'r2'] },
			{ label: 'Щелчки', result: 'Разряжен АКБ или неисправен стартер', fusesToCheck: ['ef3', 'r2'] },
			{ label: 'Крутит но не заводится', result: 'Проверьте топливную систему', fusesToCheck: ['ef8', 'r3'] }
		]
	},
	{
		id: 3,
		question: 'Какой именно свет?',
		options: [
			{ label: 'Ближний свет', result: 'Проверьте предохранитель F4', fusesToCheck: ['ef4'] },
			{ label: 'Дальний свет', result: 'Проверьте F5 и F6', fusesToCheck: ['ef5', 'ef6'] },
			{ label: 'Габариты', result: 'Проверьте F3 и F4 в салоне', fusesToCheck: ['cf3', 'cf4'] },
			{ label: 'Стоп-сигналы', result: 'Проверьте F10 и выключатель педали', fusesToCheck: ['cf10'] }
		]
	},
	{
		id: 4,
		question: 'Что именно с климатом?',
		options: [
			{ label: 'Не холодит кондиционер', result: 'Проверьте F14 и реле R4', fusesToCheck: ['cf14', 'r4'] },
			{ label: 'Не греет печка', result: 'Проверьте уровень ОЖ и заслонки', fusesToCheck: [] },
			{ label: 'Не работает обогрев стекла', result: 'Проверьте F11', fusesToCheck: ['cf11'] },
			{ label: 'Не работает подогрев сидений', result: 'Проверьте F15', fusesToCheck: ['cf15'] }
		]
	},
	{
		id: 5,
		question: 'Какая система салона?',
		options: [
			{ label: 'Стеклоподъемники', result: 'Проверьте F7 (30A)', fusesToCheck: ['cf7'] },
			{ label: 'Центральный замок', result: 'Проверьте F13', fusesToCheck: ['cf13'] },
			{ label: 'Магнитола', result: 'Проверьте F9 и постоянное питание', fusesToCheck: ['cf9'] },
			{ label: 'Прикуриватель', result: 'Проверьте F2', fusesToCheck: ['cf2'] }
		]
	}
];

export default function VisualFuseboxPage() {
	const router = useRouter();
	const [selectedFuse, setSelectedFuse] = useState<FusePosition | null>(null);
	const [highlightedFuses, setHighlightedFuses] = useState<string[]>([]);
	const [wizardStep, setWizardStep] = useState<WizardStep | null>(null);
	const [wizardHistory, setWizardHistory] = useState<number[]>([]);
	const [selectedGroup, setSelectedGroup] = useState<CircuitGroup | null>(null);
	const [activeTab, setActiveTab] = useState<'visual' | 'wizard' | 'groups'>('visual');

	const handleFuseClick = (fuse: FusePosition) => {
		setSelectedFuse(fuse);
		// Highlight related fuses
		if (fuse.relatedFuses) {
			setHighlightedFuses([fuse.id, ...fuse.relatedFuses]);
		} else {
			setHighlightedFuses([fuse.id]);
		}
	};

	const startWizard = () => {
		setWizardStep(TROUBLESHOOTING_WIZARD[0]);
		setWizardHistory([1]);
	};

	const handleWizardOption = (option: any) => {
		if (option.nextStep) {
			const nextStep = TROUBLESHOOTING_WIZARD.find(s => s.id === option.nextStep);
			if (nextStep) {
				setWizardStep(nextStep);
				setWizardHistory([...wizardHistory, option.nextStep]);
			}
		} else if (option.result) {
			// Show result
			setHighlightedFuses(option.fusesToCheck || []);
		}
	};

	const FuseBox = ({ layout, title, location }: { layout: FusePosition[][], title: string, location: string }) => (
		<Card className="p-4">
			<div className="flex items-center justify-between mb-3">
				<h3 className="font-semibold">{title}</h3>
				<Badge variant="outline">{location}</Badge>
			</div>

			{/* Visual representation */}
			<div className="bg-gray-100 rounded-lg p-3">
				{layout.map((row, rowIdx) => (
					<div key={rowIdx} className="flex gap-1 mb-1">
						{row.map((fuse) => {
							const color = FUSE_COLORS[fuse.color as keyof typeof FUSE_COLORS];
							const isHighlighted = highlightedFuses.includes(fuse.id);
							const isRelay = fuse.amperage === 0;
							
							return (
								<button
									key={fuse.id}
									onClick={() => handleFuseClick(fuse)}
									className={`
										flex-1 aspect-square rounded flex flex-col items-center justify-center
										text-white text-xs font-medium transition-all
										${isHighlighted ? 'ring-4 ring-blue-400 scale-110' : ''}
										${isRelay ? 'rounded-full' : ''}
									`}
									style={{ 
										backgroundColor: color.hex,
										opacity: highlightedFuses.length > 0 && !isHighlighted ? 0.3 : 1
									}}
								>
									<span className="text-[10px] font-bold">{fuse.position}</span>
									{!isRelay && <span className="text-[8px]">{fuse.amperage}A</span>}
								</button>
							);
						})}
					</div>
				))}
			</div>

			{/* Location hint */}
			<div className="mt-3 p-2 bg-blue-50 rounded-lg text-xs">
				<div className="flex items-start gap-2">
					<MapPin className="w-3 h-3 text-blue-600 mt-0.5" />
					<div>
						{location === 'engine' ? (
							<p>Находится в моторном отсеке, слева от АКБ</p>
						) : (
							<p>Под панелью со стороны водителя, слева от руля</p>
						)}
					</div>
				</div>
			</div>
		</Card>
	);

	return (
		<div className="min-h-screen bg-gray-50 pb-20">
			{/* Header */}
			<div className="bg-white border-b px-4 py-3">
				<h1 className="text-xl font-semibold">Визуальная схема предохранителей</h1>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
				<TabsList className="grid grid-cols-3 w-full px-4 mt-4">
					<TabsTrigger value="visual">
						<Eye className="w-4 h-4 mr-1" />
						Схема
					</TabsTrigger>
					<TabsTrigger value="wizard">
						<Navigation2 className="w-4 h-4 mr-1" />
						Мастер
					</TabsTrigger>
					<TabsTrigger value="groups">
						<Zap className="w-4 h-4 mr-1" />
						Системы
					</TabsTrigger>
				</TabsList>

				{/* Visual Tab */}
				<TabsContent value="visual" className="p-4 space-y-4">
					<Alert className="border-blue-200 bg-blue-50">
						<Info className="h-4 w-4" />
						<AlertDescription>
							Нажмите на предохранитель для просмотра деталей и связанных цепей
						</AlertDescription>
					</Alert>

					{/* Engine Compartment Fusebox */}
					<FuseBox 
						layout={ENGINE_FUSEBOX_LAYOUT}
						title="Блок в моторном отсеке"
						location="engine"
					/>

					{/* Cabin Fusebox */}
					<FuseBox 
						layout={CABIN_FUSEBOX_LAYOUT}
						title="Блок в салоне"
						location="cabin"
					/>

					{/* Quick Access */}
					<Card className="p-4">
						<h3 className="font-semibold mb-3">Быстрый доступ</h3>
						<div className="grid grid-cols-2 gap-2">
							<Button 
								variant="outline" 
								size="sm"
								onClick={() => {
									setHighlightedFuses(['ef4', 'ef5', 'ef6', 'cf3', 'cf4']);
								}}
							>
								💡 Все фары
							</Button>
							<Button 
								variant="outline" 
								size="sm"
								onClick={() => {
									setHighlightedFuses(['ef3', 'ef8', 'r1', 'r2', 'r3']);
								}}
							>
								🔑 Система запуска
							</Button>
							<Button 
								variant="outline" 
								size="sm"
								onClick={() => {
									setHighlightedFuses(['cf14', 'r4']);
								}}
							>
								❄️ Кондиционер
							</Button>
							<Button 
								variant="outline" 
								size="sm"
								onClick={() => {
									setHighlightedFuses(['cf2', 'cf9']);
								}}
							>
								🔌 Питание 12В
							</Button>
						</div>
					</Card>
				</TabsContent>

				{/* Wizard Tab */}
				<TabsContent value="wizard" className="p-4 space-y-4">
					{!wizardStep ? (
						<Card className="p-6 text-center">
							<div className="text-4xl mb-3">🔍</div>
							<h3 className="text-lg font-semibold mb-2">Мастер диагностики</h3>
							<p className="text-sm text-gray-600 mb-4">
								Пошаговая помощь в поиске неисправности
							</p>
							<Button onClick={startWizard}>
								Начать диагностику
							</Button>
						</Card>
					) : (
						<Card className="p-4">
							{/* Progress */}
							<div className="mb-4">
								<div className="flex items-center justify-between text-sm mb-2">
									<span>Шаг {wizardHistory.length}</span>
									<Button 
										variant="ghost" 
										size="sm"
										onClick={() => {
											if (wizardHistory.length > 1) {
												const newHistory = wizardHistory.slice(0, -1);
												const prevStepId = newHistory[newHistory.length - 1];
												const prevStep = TROUBLESHOOTING_WIZARD.find(s => s.id === prevStepId);
												setWizardStep(prevStep || null);
												setWizardHistory(newHistory);
											} else {
												setWizardStep(null);
												setWizardHistory([]);
											}
										}}
									>
										Назад
									</Button>
								</div>
								<Progress value={(wizardHistory.length / 3) * 100} />
							</div>

							<h3 className="font-semibold mb-4">{wizardStep.question}</h3>
							
							<div className="space-y-2">
								{wizardStep.options.map((option, idx) => (
									<Card
										key={idx}
										className="p-3 cursor-pointer hover:bg-gray-50 transition-all"
										onClick={() => handleWizardOption(option)}
									>
										<div className="flex items-center justify-between">
											<span>{option.label}</span>
											<ChevronRight className="w-4 h-4 text-gray-400" />
										</div>
									</Card>
								))}
							</div>

							{/* Result */}
							{wizardStep.options[0].result && (
								<Alert className="mt-4 border-green-200 bg-green-50">
									<CheckCircle className="h-4 w-4" />
									<AlertDescription>
										<div className="font-medium mb-2">Рекомендация:</div>
										{wizardStep.options.find(o => highlightedFuses.length > 0)?.result}
									</AlertDescription>
								</Alert>
							)}
						</Card>
					)}

					{/* Highlighted fuses from wizard */}
					{highlightedFuses.length > 0 && wizardStep && (
						<Card className="p-4">
							<h4 className="font-medium mb-2">Проверьте эти предохранители:</h4>
							<div className="flex flex-wrap gap-2">
								{highlightedFuses.map(fuseId => {
									const fuse = [...ENGINE_FUSEBOX_LAYOUT.flat(), ...CABIN_FUSEBOX_LAYOUT.flat()]
										.find(f => f.id === fuseId);
									if (!fuse) return null;
									
									return (
										<Badge 
											key={fuseId}
											className="cursor-pointer"
											onClick={() => handleFuseClick(fuse)}
										>
											{fuse.position} ({fuse.amperage}A) - {fuse.circuits[0]}
										</Badge>
									);
								})}
							</div>
						</Card>
					)}
				</TabsContent>

				{/* Circuit Groups Tab */}
				<TabsContent value="groups" className="p-4 space-y-3">
					{CIRCUIT_GROUPS.map(group => (
						<Card 
							key={group.name}
							className="p-3 cursor-pointer hover:shadow-md transition-all"
							onClick={() => {
								setSelectedGroup(group);
								setHighlightedFuses(group.fuses);
							}}
						>
							<div className="flex items-start gap-3">
								<span className="text-2xl">{group.icon}</span>
								<div className="flex-1">
									<h3 className="font-semibold">{group.name}</h3>
									<p className="text-sm text-gray-600 mt-1">{group.description}</p>
									<div className="flex flex-wrap gap-1 mt-2">
										{group.fuses.map(fuseId => {
											const fuse = [...ENGINE_FUSEBOX_LAYOUT.flat(), ...CABIN_FUSEBOX_LAYOUT.flat()]
												.find(f => f.id === fuseId);
											return fuse ? (
												<Badge key={fuseId} variant="secondary" className="text-xs">
													{fuse.position}
												</Badge>
											) : null;
										})}
									</div>
								</div>
								<ChevronRight className="w-5 h-5 text-gray-400" />
							</div>
						</Card>
					))}
				</TabsContent>
			</Tabs>

			{/* Selected Fuse Detail */}
			{selectedFuse && (
				<div 
					className="fixed inset-0 bg-black/50 z-50 flex items-end"
					onClick={() => {
						setSelectedFuse(null);
						setHighlightedFuses([]);
					}}
				>
					<Card 
						className="w-full max-h-[70vh] overflow-y-auto rounded-t-xl p-6" 
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-start gap-4 mb-4">
							<div 
								className={`w-16 h-16 ${selectedFuse.amperage === 0 ? 'rounded-full' : 'rounded-lg'} flex items-center justify-center text-white text-xl font-bold`}
								style={{ backgroundColor: FUSE_COLORS[selectedFuse.color as keyof typeof FUSE_COLORS].hex }}
							>
								{selectedFuse.position}
							</div>
							<div className="flex-1">
								<h2 className="text-xl font-semibold">
									{selectedFuse.amperage > 0 
										? `Предохранитель ${selectedFuse.position}` 
										: `Реле ${selectedFuse.position}`}
								</h2>
								{selectedFuse.amperage > 0 && (
									<p className="text-gray-600">{selectedFuse.amperage}A</p>
								)}
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<h3 className="font-medium mb-2">Защищаемые цепи:</h3>
								<ul className="list-disc list-inside text-gray-700">
									{selectedFuse.circuits.map((circuit, idx) => (
										<li key={idx}>{circuit}</li>
									))}
								</ul>
							</div>

							{selectedFuse.relatedFuses && selectedFuse.relatedFuses.length > 0 && (
								<div>
									<h3 className="font-medium mb-2">Связанные компоненты:</h3>
									<div className="flex flex-wrap gap-2">
										{selectedFuse.relatedFuses.map(relId => {
											const relFuse = [...ENGINE_FUSEBOX_LAYOUT.flat(), ...CABIN_FUSEBOX_LAYOUT.flat()]
												.find(f => f.id === relId);
											return relFuse ? (
												<Badge 
													key={relId}
													className="cursor-pointer"
													onClick={() => handleFuseClick(relFuse)}
												>
													{relFuse.position} - {relFuse.circuits[0]}
												</Badge>
											) : null;
										})}
									</div>
								</div>
							)}

							<Alert className="border-yellow-200 bg-yellow-50">
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription>
									<div className="font-medium mb-1">Как проверить:</div>
									<ol className="text-sm space-y-1">
										<li>1. Выключите зажигание</li>
										<li>2. Визуально проверьте целостность нити</li>
										<li>3. Проверьте тестером на разрыв</li>
										<li>4. Замените на предохранитель того же номинала</li>
									</ol>
								</AlertDescription>
							</Alert>

							<div className="flex gap-2">
								<Button 
									variant="outline"
									className="flex-1"
									onClick={() => {
										// Add to maintenance log
										router.push('/journal');
									}}
								>
									<Wrench className="w-4 h-4 mr-2" />
									Записать замену
								</Button>
								<Button 
									variant="outline"
									onClick={() => {
										// Take photo
									}}
								>
									<Camera className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</Card>
				</div>
			)}

			{/* Selected Circuit Group Detail */}
			{selectedGroup && (
				<div 
					className="fixed inset-0 bg-black/50 z-50 flex items-end"
					onClick={() => {
						setSelectedGroup(null);
						setHighlightedFuses([]);
					}}
				>
					<Card 
						className="w-full max-h-[70vh] overflow-y-auto rounded-t-xl p-6" 
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-start gap-3 mb-4">
							<span className="text-3xl">{selectedGroup.icon}</span>
							<div>
								<h2 className="text-xl font-semibold">{selectedGroup.name}</h2>
								<p className="text-gray-600">{selectedGroup.description}</p>
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<h3 className="font-medium mb-2">Компоненты системы:</h3>
								<div className="space-y-2">
									{selectedGroup.fuses.map(fuseId => {
										const fuse = [...ENGINE_FUSEBOX_LAYOUT.flat(), ...CABIN_FUSEBOX_LAYOUT.flat()]
											.find(f => f.id === fuseId);
										if (!fuse) return null;
										
										return (
											<div 
												key={fuseId}
												className="flex items-center justify-between p-2 bg-gray-50 rounded"
											>
												<div>
													<span className="font-medium">{fuse.position}</span>
													<span className="text-sm text-gray-600 ml-2">
														({fuse.amperage}A) - {fuse.circuits.join(', ')}
													</span>
												</div>
												<Badge variant={fuse.row <= 2 ? 'default' : 'secondary'}>
													{fuse.row <= 2 ? 'Моторный' : 'Салон'}
												</Badge>
											</div>
										);
									})}
								</div>
							</div>

							<div>
								<h3 className="font-medium mb-2">Порядок диагностики:</h3>
								<ol className="space-y-1">
									{selectedGroup.troubleshooting.map((step, idx) => (
										<li key={idx} className="flex gap-2 text-sm">
											<span className="font-bold text-blue-600">{idx + 1}.</span>
											<span>{step}</span>
										</li>
									))}
								</ol>
							</div>
						</div>
					</Card>
				</div>
			)}
		</div>
	);
}
