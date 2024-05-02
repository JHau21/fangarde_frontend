const ErrorCode404 = ({ message }: { message?: string }) => {
	return (
		<div className={"flex h-[400px] flex-col items-center justify-center font-custom text-fangarde-black"}>
			<h1 className={"text-lg-header font-bold text-medium-blue"}>Error Code 404</h1>
			<h3 className={"text-sm-header font-medium"}>{message ?? "Could not find the requested page!"}</h3>
		</div>
	);
};

export default ErrorCode404;
