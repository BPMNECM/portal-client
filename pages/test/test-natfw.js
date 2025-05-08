import React, {useState} from 'react';
import useNATFWDesign from '@/components/Design/UpdateNATFW';
import {Badge, Button, Card, Group, Image, Text} from '@mantine/core';

const TestNATFWComponent = () => {
	const [orderId, setOrderId] = useState('673d2a98005daf3c34c22ae6'); // Test Order ID
	const {updateNATFWDesign, errorMessage, designNotification} = useNATFWDesign(orderId);
	
	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Card.Section>
				<Image
					src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
					height={160}
					alt="Norway"
				/>
			</Card.Section>
			
			<Group position="apart" mt="md" mb="xs">
				<Text weight={500}>Run NATFW Design</Text>
				<Badge color="pink" variant="light">
					useNATFWDesign Hook
				</Badge>
			</Group>
			
			<Text size="sm" color="dimmed">
				Manual UI Testing Test - Pass an orderId manually and trigger updateNATFWDesign() from a button click.
			</Text>
			
			<Button
				onClick={updateNATFWDesign}
				variant="light"
				color="blue"
				fullWidth mt="md"
				radius="md">
				Run NATFW Design
			</Button>
			
			<Text size="sm" mt="md">
				Design Notifications:
				<ul>
					{designNotification.map((notification, index) => (
						<li key={index}>
							<strong>
								{notification.step}:
							</strong>
							{notification.message} [{notification.status}]
						</li>
					))}
				</ul>
			</Text>
			
			<Text mt="md" color="dimmed" size="sm">
				Error Messages:
				<ul>
					{errorMessage.map((err, index) => (
						<li key={index} style={{color: 'red'}}>
							❌ {err}
						</li>
					))}
				</ul>
			</Text>
		
		</Card>
	
	
	);
};


export default TestNATFWComponent;
