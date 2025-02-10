'use client';
import React from 'react';
import { User, Tooltip } from '@nextui-org/react';
import { ChevronRightIcon, LayersIcon } from '@radix-ui/react-icons';
import { AiOutlineFileSearch } from 'react-icons/ai';

export const TabTitle = ({ room, selectedKey }) => {
	return (
		<Tooltip
			content={`${room.name} | ${room.infoZip ? 'InfoZip' : 'Ai'}`}
			className='flex md:hidden m-auto'
			placement='right'
		>
			<div className='flex items-center m-auto justify-center md:justify-between space-x-2 min-w-auto max-w-auto md:min-w-[200px] md:max-w-[200px] md:text-ellipsis md:overflow-x-hidden chatroom'>
				<User
					size='sm'
					avatarProps={{
						showFallback: true,
						icon: room.infoZip ? (
							<AiOutlineFileSearch size={20} />
						) : (
							<LayersIcon className='-rotate-90' width='20' height='20' />
						),
						color: 'primary',
						size: 'sm',
					}}
					description={<span className='hidden md:flex m-auto'>{room.infoZip ? 'InfoZip' : 'Ai'}</span>}
					name={<span className='hidden md:flex'>{room.name}</span>}
				/>
				{room.id === selectedKey && <ChevronRightIcon color='purple' className='hidden !me-3 md:flex' />}
			</div>
		</Tooltip>
	);
};
