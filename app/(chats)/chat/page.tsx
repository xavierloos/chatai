'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Tabs, Tab, Card, CardBody, Input, Button } from '@nextui-org/react';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

export default function App() {
	const [isVertical, setIsVertical] = React.useState(true);
	const [data, setData] = useState(null);

	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const chatContainerRef = useRef(null);
	const handleSendMessage = () => {
		if (input.trim() === '') return;

		const timestamp = new Date().toLocaleTimeString();
		const newMessage = { text: input, sender: 'user', time: timestamp };

		// Update messages with user input and simulated response
		setMessages((prevMessages) => [
			...prevMessages,
			newMessage,
			{ text: 'Response from the system', sender: 'system', time: timestamp },
		]);

		setInput(''); // Clear input field
	};

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
		}
		fetch('http://127.0.0.1:5000/api')
			.then((res) => res.json())
			.then((data) => setData(data.message));
	}, [messages]);

	return (
		<Tabs aria-label='Options' isVertical={isVertical} variant='bordered'>
			<Tab key='photos' title='Photos' className='w-full h-full'>
				<div className='w-full h-full bg-primary-foreground shadow-lg flex flex-col'>
					<div ref={chatContainerRef} className='flex-1 overflow-y-auto px-4 py-2 space-y-4'>
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
							>
								{/* Message Bubble */}
								<div
									className={`relative px-4 py-2 rounded-lg ${
										msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
									}`}
									style={{
										borderRadius: '1rem',
										position: 'relative',
										maxWidth: '75%',
									}}
								>
									{msg.text}

									{/* Bubble Tail */}
									<div
										className={`absolute w-3 h-3 ${
											msg.sender === 'user'
												? 'bg-blue-500 right-0 -mr-2'
												: 'bg-gray-200 left-0 -ml-2'
										}`}
										style={{
											clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
											bottom: '0.25rem',
										}}
									></div>
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
								<Button isIconOnly radius='full' color='primary' size='md' onClick={handleSendMessage}>
									<PaperPlaneIcon />
								</Button>
							}
							placeholder='Ask me something'
							type='text'
						/>
					</div>
				</div>
			</Tab>
			<Tab key='music' title='Music' className='w-full h-full'>
				<div className='w-full h-full bg-primary-foreground shadow-lg flex flex-col'>
					<div className='flex-1 overflow-y-auto px-4 py-2 space-y-4'>
						{/* INPUT */}
						<div className='flex items-start space-x-2'>
							<div className='bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs'>
								Hi there! How can I help you today?
							</div>
						</div>
						{/* RESPONSE */}
						<div className='flex items-end justify-end space-x-2'>
							<div className='bg-primary text-white px-4 py-2 rounded-lg max-w-xs'>
								I need some assistance with my account.
							</div>
						</div>
					</div>
					<div className='flex items-center space-x-2 px-4 py-3'>
						<input
							type='text'
							placeholder='Type a message...'
							className='flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300'
						/>
						<button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'>Send</button>
					</div>
				</div>
			</Tab>
			<Tab key='videos' title='Videos' className='w-full h-full'>
				<div className='w-full h-full bg-primary-foreground shadow-lg flex flex-col'>
					<div className='flex-1 overflow-y-auto px-4 py-2 space-y-4'>
						{/* INPUT */}
						<div className='flex items-start space-x-2'>
							<div className='bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs'>
								Hi there! How can I help you today?
							</div>
						</div>
						{/* RESPONSE */}
						<div className='flex items-end justify-end space-x-2'>
							<div className='bg-primary text-white px-4 py-2 rounded-lg max-w-xs'>
								I need some assistance with my account.
							</div>
						</div>
					</div>
					<div className='flex items-center space-x-2 px-4 py-3'>
						<input
							type='text'
							placeholder='Type a message...'
							className='flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300'
						/>
						<button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'>Send</button>
					</div>
				</div>
			</Tab>
		</Tabs>
	);
}
