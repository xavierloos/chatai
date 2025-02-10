'use client';
import React, { useEffect, useState, useRef } from 'react';
import {
	Tabs,
	Tab,
	Input,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Switch,
	Avatar,
	cn,
	Textarea,
	User,
	Tooltip,
} from '@nextui-org/react';
import {
	PaperPlaneIcon,
	PlusIcon,
	ChatBubbleIcon,
	ReaderIcon,
	ChevronRightIcon,
	UploadIcon,
	TrashIcon,
	LayersIcon,
	PersonIcon,
	Cross2Icon,
} from '@radix-ui/react-icons';
import { Alert } from '@heroui/react';
import { AiOutlineFileSearch } from 'react-icons/ai';

import { Message } from './_components/Message';
import { TabHeader } from './_components/TabHeader';
import { Header } from './_components/header';
import { TabTitle } from './_components/TabTitle';

export default function App() {
	const [alertConfig, setAlertConfig] = useState({ visible: false, message: '', color: '' });
	const [isLoading, setIsLoading] = useState(true);
	const [isInfoZip, setIsInfoZip] = useState(false);
	const [rooms, setRooms] = useState([]);
	const [message, setMessage] = useState([]);
	const [messages, setMessages] = useState([]);
	const [chatName, setChatName] = useState('');
	const [input, setInput] = useState('');
	const chatContainerRef = useRef(null);
	const [selectedKey, setSelectedKey] = useState(null);
	const [prevSelectedKey, setPrevSelectedKey] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const fetchRooms = async () => {
		try {
			const response = await fetch('http://127.0.0.1:5001/api/rooms');
			const data = await response.json();
			setRooms(data.rooms);
			if (data.rooms.length > 0) {
				const initialMessages = await fetchMessages(data.rooms[0].id);
				setMessages(initialMessages);
				// setPrevSelectedKey(data.rooms[0].id);
				setSelectedKey(data.rooms[0].id);
			}
		} catch (error) {
			console.error('Error fetching chat rooms:', error);
		}
	};

	const fetchMessages = async (roomId) => {
		try {
			const response = await fetch(`http://127.0.0.1:5001/api/rooms/${roomId}`);
			const data = await response.json();
			return data.messages;
		} catch (error) {
			console.error('Error fetching messages:', error);
			return [];
		}
	};

	const createRoom = async () => {
		if (!chatName.trim()) return;
		try {
			const response = await fetch('http://127.0.0.1:5001/api/rooms', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: chatName, infoZip: isInfoZip }),
			});
			const data = await response.json();
			if (response.ok) {
				await fetchRooms();
				const msg = await fetchMessages(data.room.id);
				setMessages(msg);
				setSelectedKey(data.room.id);
				setAlertConfig({ visible: true, message: data.message, color: 'success' });
			} else {
				setAlertConfig({ visible: true, message: data.error, color: 'danger' });
			}
		} catch (error) {
			setAlertConfig({ visible: true, message: 'Error creating chat room', color: 'danger' });
		}
		alerTimer();
		onClose();
	};

	const handleSendMessage = async () => {};

	const changeRoom = async (roomId) => {
		const msg = await fetchMessages(roomId);
		setPrevSelectedKey(selectedKey);
		setMessages(msg);
		setSelectedKey(roomId);
	};

	const deleteRoom = async (roomId) => {
		try {
			const response = await fetch(`http://127.0.0.1:5001/api/rooms/${roomId}`, { method: 'DELETE' });
			const data = await response.json();
			if (response.ok) {
				await fetchRooms();
				setSelectedKey(prevSelectedKey);
				setAlertConfig({ visible: true, message: data.message, color: 'success' });
			} else {
				setAlertConfig({ visible: true, message: data.error, color: 'danger' });
			}
		} catch (error) {
			setAlertConfig({ visible: true, message: 'Error deleting room', color: 'danger' });
		}
		alerTimer();
	};

	useEffect(() => {
		fetchRooms();
		setIsLoading(false);
	}, []);

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
		}
	}, [messages]);

	const cancelCreateRoom = async () => {
		await fetchRooms();
		const msg = await fetchMessages(prevSelectedKey);
		setMessages(msg);
		setSelectedKey(prevSelectedKey);
		return onClose();
	};

	const alerTimer = () => {
		const timer = setTimeout(() => {
			setAlertConfig((prev) => ({ ...prev, visible: false }));
		}, 5000);
		return () => clearTimeout(timer);
	};

	if (isLoading) return <div>Loading...</div>;

	return (
		<>
			<Tabs
				aria-label='Chats'
				isVertical={true}
				selectedKey={selectedKey}
				radius='sm'
				onSelectionChange={(e) => changeRoom(e)}
			>
				{rooms.map((room) => (
					<Tab
						download='true'
						fullWidth
						key={room.id}
						title={<TabTitle room={room} selectedKey={selectedKey} />}
						className='w-full h-full !px-1 md:!px-3'
					>
						<div className='w-full h-full bg-primary-foreground shadow-lg flex flex-col rounded-xl'>
							<TabHeader room={room} deleteRoom={deleteRoom} />
							<div ref={chatContainerRef} className='flex-1 overflow-y-auto px-4 py-2 space-y-4'>
								<h2 className='w-full flex justify-center text-xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-100 drop-shadow-sm my-3'>
									Welcome aboard!
								</h2>
								{selectedKey === room.id && messages?.map((msg, index) => <Message message={msg} />)}
							</div>
							<div className='flex items-center space-x-1 px-2 py-1 md:space-x-2 md:px-4 md:py-3'>
								<Textarea
									shadow='md'
									radius='lg'
									size='sm'
									minRows='1'
									fullWidth
									onValueChange={(e) => setMessage(e)}
									endContent={
										<Button
											isIconOnly
											radius='full'
											color='primary'
											size='sm'
											onClick={handleSendMessage}
											isDisabled={!message}
										>
											<PaperPlaneIcon />
										</Button>
									}
									placeholder='Ask me something'
								/>
								{room.infoZip && (
									<Button
										isIconOnly
										radius='full'
										color='primary'
										size='md'
										onPress={handleSendMessage}
									>
										<UploadIcon />
									</Button>
								)}
							</div>
						</div>
					</Tab>
				))}

				<Tab
					isDisabled={rooms.length >= 10 ?? true}
					key='create'
					title={
						<div
							onClick={onOpen}
							className='flex items-center justify-start space-x-2 md:min-w-[200px] md:max-w-[200px] md:text-ellipsis md:overflow-x-hidden chatroom'
						>
							<Tooltip content={`Create`} className='flex md:hidden m-auto' placement='right'>
								<User
									size='sm'
									avatarProps={{
										showFallback: true,
										icon: <PlusIcon />,
										color: 'default',
										size: 'sm',
									}}
									name={<span className='hidden  md:flex'>Create</span>}
								/>
							</Tooltip>
						</div>
					}
					className='w-full h-full'
				/>
			</Tabs>

			<Modal isOpen={isOpen} onOpenChange={onOpen} backdrop='blur' hideCloseButton={true}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className='flex flex-col gap-1'>Create a new chat</ModalHeader>
							<ModalBody>
								<Input
									radius='sm'
									fullWidth
									onChange={(e) => setChatName(e.target.value)}
									label='Chat Name'
									type='text'
									isRequired
								/>
								<Switch
									isSelected={isInfoZip}
									onValueChange={setIsInfoZip}
									classNames={{
										base: cn(
											'inline-flex flex-row-reverse w-full bg-content1 hover:bg-content2 items-center',
											'justify-between cursor-pointer rounded-lg gap-1 p-1 border-2 border-transparent',
											'data-[selected=true]:border-primary'
										),
										wrapper: 'p-0 h-5 overflow-visible',
										thumb: cn(
											'w-6 h-6 border-1 shadow-sm',
											'group-data-[hover=true]:border-primary',
											'group-data-[selected=true]:ms-6',
											'group-data-[pressed=true]:w-7',
											'group-data-[selected]:group-data-[pressed]:ms-4'
										),
									}}
								>
									<div className='flex flex-col gap-2'>
										<div className='text-medium'>InfoZip</div>
										<div className='text-tiny text-default-400'>
											Select to feed your chat with files — enhance your conversation by providing
											instant access to documents, enabling richer and more detailed responses.
										</div>
									</div>
								</Switch>
							</ModalBody>
							<ModalFooter>
								<Button color='danger' variant='light' onPress={cancelCreateRoom}>
									Cancel
								</Button>
								<Button color='primary' onPress={onClose} onClick={createRoom}>
									Create
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{alertConfig.visible && (
				<div
					className={`fixed top-5 right-1 transform md:-translate-x-1/2 z-50 transition-opacity duration-500 !h-max ${
						alertConfig.visible ? 'flex' : 'flex'
					}`}
				>
					<Alert color={alertConfig.color} onClose={() => setAlertConfig({ ...alertConfig, visible: false })}>
						{alertConfig.message}
					</Alert>
				</div>
			)}
		</>
	);
}
