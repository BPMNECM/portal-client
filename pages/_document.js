import Document, {Head, Html, Main, NextScript} from 'next/document';

class MyDocument extends Document {
	render() {
		return (
			<Html lang="en" className="h-full bg-white">
				<Head>
					{/* Including external stylesheet for Inter font */}
					<link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>
					<meta charSet="UTF-8"/>
				</Head>
				<body className="h-full">
				<Main/>
				<NextScript/>
				</body>
			</Html>
		);
	}
}

export default MyDocument;
