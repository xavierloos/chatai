'use client';
import React from 'react';
import { Avatar } from '@nextui-org/react';
import { LayersIcon, PersonIcon } from '@radix-ui/react-icons';
import { AiOutlineFileSearch } from 'react-icons/ai';

export const Message = ({ message }) => {
	const isUser = message.sender === 'user';
	const avatarIcon = isUser ? (
		<PersonIcon width='20' height='20' />
	) : message.sender === 'file' ? (
		<AiOutlineFileSearch size={20} />
	) : (
		<LayersIcon className='-rotate-90' width='20' height='20' />
	);

	return (
		<div className={`flex flex-col items-start ${!isUser && 'items-end'}`}>
			<div className={`flex flex-row items-end gap-1 md:gap-2 ${!isUser && 'flex-row-reverse'}`}>
				<Avatar
					showFallback
					icon={avatarIcon}
					classNames={{
						base: `shadow-md bg-default ${!isUser && 'bg-primary text-primary-foreground'}`,
					}}
				/>
				<div
					className={`relative px-3 py-1 md:px-4 md:py-2 shadow-md text-tiny md:text-medium ${
						isUser ? 'bg-gray-200 text-gray-800' : 'bg-primary text-white'
					}`}
					style={{
						borderRadius: '1rem',
						position: 'relative',
						maxWidth: '70%',
					}}
				>
					{message.text}
					<div
						className={`absolute w-3 h-3 ${
							isUser ? 'bg-gray-200 left-0 -ml-2' : 'bg-primary right-0 -mr-1.5 rotate-90'
						}`}
						style={{ clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)', bottom: '0.25rem' }}
					></div>
				</div>
			</div>
			<div className='text-xs text-gray-500 mt-1'>{message.time}</div>
		</div>
	);
};
