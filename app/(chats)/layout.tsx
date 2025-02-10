import { Sidebar } from './chat/_components/sidebar';

import { Header } from './chat/_components/header';
import Providers from './providers';
import { LockClosedIcon } from '@radix-ui/react-icons';

interface ProtectedLayoutProps {
	children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
	return (
		<Providers>
			<div className='bg-primary w-full overflow-y-hidden '>
				<div className='w-full md:container flex m-auto justify-center'>
					<div className='w-full h-screen max-w-[900px] '>
						<div className='h-1/6  flex justify-center items-center'>
							<Header />
						</div>
						<div className='h-5/6 chats pb-4 md:pb-8 px-2'>{children}</div>
					</div>
				</div>
			</div>
		</Providers>
	);
};
export default ProtectedLayout;
