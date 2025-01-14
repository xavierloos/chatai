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
import { useEffect, useState, useTransition } from 'react';

import { ExitIcon, InfoCircledIcon } from '@radix-ui/react-icons';

export const Header = () => {
	return (
		<h1 className='font-bold  text-primary-foreground'>
			ChatAi<span className=' !text-xl'>nfosys</span>
		</h1>
	);
};
