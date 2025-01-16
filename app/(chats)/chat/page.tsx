'use client';
import React, { useEffect, useState, useRef } from 'react';
import {
	Tabs,
	Tab,
	Card,
	CardBody,
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
} from '@nextui-org/react';
import { PaperPlaneIcon, PlusIcon, ChatBubbleIcon, ReaderIcon, ChevronRightIcon } from '@radix-ui/react-icons';

export default function App() {
	const [isVertical, setIsVertical] = React.useState(true);
	const [isInfoZip, setIsInfoZip] = React.useState(false);
	const [rooms, setRooms] = useState([]);
	const [messages, setMessages] = useState([]);
	const [chatName, setChatName] = useState('');
	const chatContainerRef = useRef(null);
	const [selectedKey, setSelectedKey] = React.useState(null);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	useEffect(() => {
		const fetchRooms = async () => {
			try {
				const response = await fetch('http://127.0.0.1:5001/api/rooms');
				const data = await response.json();

				setRooms(data.rooms);
				setSelectedKey(data.rooms[0].id);
			} catch (error) {
				console.error('Error fetching chat rooms:', error);
			}
		};

		fetchRooms();
	}, []);

	// Create a new chat room
	const createRoom = async () => {
		if (!chatName.trim()) return;
		try {
			const response = await fetch('http://127.0.0.1:5000/api/chatrooms', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: chatName, infoZip: isInfoZip }),
			});
			const data = await response.json();
			if (response.ok) {
				setRooms((prevRooms) => [...prevRooms, chatName]);
				setChatName('');
				alert(data.message);
			} else {
				alert(data.error);
			}
		} catch (error) {
			console.error('Error creating chat room:', error);
		}
	};

	const handleSendMessage = async () => {
		if (input.trim() === '') return;

		const timestamp = new Date().toLocaleTimeString();
		const userMessage = { text: input, sender: 'user', time: timestamp };

		try {
			const response = await fetch('http://127.0.0.1:5000/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ chat: userMessage }),
			});
			const data = await response.json();

			setMessages((prevMessages) => [...prevMessages, userMessage, data.response]);
		} catch (error) {
			console.error('Error sending message:', error);
		}

		setInput('');
	};

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<>
			<Tabs
				aria-label='Chats'
				isVertical={isVertical}
				size='lg'
				selectedKey={selectedKey}
				radius='sm'
				onSelectionChange={setSelectedKey}
			>
				{rooms.map((room, index) => (
					<Tab
						key={room.id}
						title={
							<div className='flex items-center justify-between space-x-2 min-w-[200px]'>
								<div className='flex items-center justify-start space-x-2'>
									{room.type === 'chatbot' ? <ChatBubbleIcon /> : <ReaderIcon />}
									<span>{room.name}</span>
								</div>
								{room.id == selectedKey && <ChevronRightIcon color='purple' />}
							</div>
						}
						className='w-full h-full'
					>
						<div className='w-full h-full bg-primary-foreground shadow-lg flex flex-col rounded-xl'>
							<div ref={chatContainerRef} className='flex-1 overflow-y-auto px-4 py-2 space-y-4'>
								{room.messages.map((msg, index) => (
									<div
										key={index}
										className={`flex flex-col items-start ${msg.sender !== 'user' && 'items-end'}`}
									>
										<div
											className={`flex flex-row items-end gap-2 ${
												msg.sender !== 'user' && 'flex-row-reverse'
											}`}
										>
											<Avatar
												showFallback
												name={msg.sender}
												classNames={{
													base: `shadow-md bg-default ${
														msg.sender !== 'user' && 'bg-primary'
													}`,
													// icon: 'text-primary',
												}}
											/>
											{/* Message Bubble */}
											<div
												className={`relative px-4 py-2 shadow-md  ${
													msg.sender !== 'user'
														? 'bg-primary text-white'
														: 'bg-gray-200 text-gray-800'
												}`}
												style={{
													borderRadius: '1rem',
													position: 'relative',
													maxWidth: '70%',
												}}
											>
												{msg.text}

												{/* Bubble Tail */}
												<div
													className={`absolute w-3 h-3 ${
														msg.sender !== 'user'
															? 'bg-primary right-0 -mr-1.5 rotate-90'
															: 'bg-gray-200 left-0 -ml-2'
													}`}
													style={{
														clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
														bottom: '0.25rem',
													}}
												></div>
											</div>
										</div>
										{/* Timestamp */}
										<div className='text-xs text-gray-500 mt-1'>{msg.time}</div>
									</div>
								))}
							</div>
							<div className='flex items-center space-x-2 px-4 py-3'>
								<Input
									shadow='lg'
									size='lg'
									fullWidth
									onChange={(e) => setInput(e.target.value)}
									endContent={
										<Button
											isIconOnly
											radius='full'
											color='primary'
											size='md'
											onClick={handleSendMessage}
										>
											<PaperPlaneIcon />
										</Button>
									}
									placeholder='Ask me something'
									type='text'
								/>
							</div>
						</div>
					</Tab>
				))}
				<Tab
					key='create'
					title={
						<div onClick={onOpen} className='flex items-center justify-start space-x-2 min-w-[200px]'>
							<PlusIcon />
							<span>Create</span>
						</div>
					}
					className='w-full h-full'
				/>
			</Tabs>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur' hideCloseButton={true}>
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
								<Button color='danger' variant='light' onPress={onClose}>
									Cancel
								</Button>
								<Button color='primary' onPress={onClose} onClick={createRoom}>
									Create
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>{' '}
		</>
	);
}
