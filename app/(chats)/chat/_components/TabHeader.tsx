'use client';
import React from 'react';
import { Tab, Button, User } from '@nextui-org/react';
import { ChevronRightIcon, TrashIcon, LayersIcon } from '@radix-ui/react-icons';
import { AiOutlineFileSearch } from 'react-icons/ai';

export const TabHeader = ({ room, deleteRoom }) => {
	console.log(room.id);

	return (
		<div className='flex items-center justify-between w-full space-x-1 px-2 py-1 shadow-sm md:space-x-2 md:px-4 md:py-3 md:shadow-md'>
			<User
				avatarProps={{
					showFallback: true,
					icon: room.infoZip ? (
						<AiOutlineFileSearch className='w-[20px] h-[20px] md:w-[30px] md:h-[30px]' />
					) : (
						<LayersIcon className='-rotate-90 w-[20px] h-[20px] md:w-[30px] md:h-[30px]' />
					),
					color: 'primary',
					size: 'md',
				}}
				description={room.infoZip ? 'InfoZip' : 'Ai'}
				name={room.name}
			/>
			<Button
				isIconOnly
				radius='full'
				color='danger'
				variant='light'
				size='sm'
				onPress={() => deleteRoom(room.id)}
			>
				<TrashIcon />
			</Button>
		</div>
	);
};
