import { v4 as uuid } from 'uuid';

interface IMenuProps {
	id: string;
	title?: string;
	name?: string;
	icon?: string;
	link?: string;
	grouptitle?: boolean;
	children?: IMenuProps[];
	badge?: string;
	badgecolor?: string;
}

export const DashboardMenu: IMenuProps[] = [
	{
		id: uuid(),
		title: 'Dashboard',
		icon: 'home',
		link: '/'
	},
	{
		id: uuid(),
		title: 'Çalışanlar',
		icon: 'user',
		link: '/employees'
	},
	{
		id: uuid(),
		title: 'İzin Yönetimi',
		icon: 'calendar',
		children: [
			{
				id: uuid(),
				link: '/leave-management/requests',
				name: 'İzin Talepleri'
			},
			{
				id: uuid(),
				link: '/leave-management/balances',
				name: 'İzin Bakiyeleri'
			},
			{
				id: uuid(),
				link: '/leave-management/types',
				name: 'İzin Türleri'
			}
		]
	},
	{
		id: uuid(),
		title: 'Tanımlamalar',
		icon: 'calendar',
		children: [
			{
				id: uuid(),
				name: 'Şirketler',
				link: '/companies'
			},
			{
				id: uuid(),
				name: 'Departmanlar',
				link: '/departments'
			},
			{
				id: uuid(),
				name: 'Pozisyonlar',
				link: '/job-positions'
			},
		]
	},
	{
		id: uuid(),
		title: 'Çalışma Bilgileri',
		icon: 'file-text',
		link: '/work-information'
	}
];

export default DashboardMenu;
