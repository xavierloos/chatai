'use client';

import { Navbar, NavbarContent, NavbarBrand } from '@nextui-org/react';
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Avatar,
	DropdownSection,
	User,
} from '@nextui-org/react';
import { LayersIcon } from '@radix-ui/react-icons';
import { useEffect, useState, useTransition } from 'react';

import { ExitIcon, InfoCircledIcon } from '@radix-ui/react-icons';

export const Header = () => {
	return (
		<div className='flex items-center'>
			<LayersIcon className='-rotate-90 text-primary-foreground w-[2em] h-[2em] md:w-[3.5em] md:h-[3.5em]' />
			<h1 className='font-bold  text-primary-foreground'>
				ChatAi<span className='!text-xl'>nfosys</span>
			</h1>
		</div>
	);
};
