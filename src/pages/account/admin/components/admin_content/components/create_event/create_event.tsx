import { useState } from "react";
import GeneralEventInfo from "./components/general_event_info/general_event_info";
import { CreateEventRequest, EmptyCreateEventRequest } from "./types";
import AdditionalEventInfo from "./components/additional_event_info/additional_event_info";
import Loader from "../../../../../../../partials/loader/loader";
import CreateEventDone from "./components/create_event_done/create_event_done";
import CreateEventError from "./components/create_event_error/create_event_error";
import TicketInfo from "./components/ticket_info/ticket_info";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { useNavigate } from "react-router-dom";
import { CreateEventFlow } from "../../../../../../../common";
import { api } from "axiosClients/client";

const CreateEvent = () => {
	const [currentStep, setCurrentStep] = useState<CreateEventFlow>(CreateEventFlow.GeneralInfo);
	const [loading, setLoading] = useState<boolean>(false);
	const [request, setRequest] = useState<CreateEventRequest>(EmptyCreateEventRequest);
	const [previousStep, setPreviousStep] = useState<CreateEventFlow>(CreateEventFlow.GeneralInfo);
	const navigate = useNavigate();
	function onContinue() {
		if (currentStep === CreateEventFlow.GeneralInfo) {
			window.scrollTo(0, 0);
			setCurrentStep(CreateEventFlow.AdditionalInfo);
		}
	}
	async function onSubmit() {
		if (currentStep === CreateEventFlow.AdditionalInfo) {
			setPreviousStep(currentStep);
			setCurrentStep(CreateEventFlow.TicketInfo);
		} else if (currentStep === CreateEventFlow.TicketInfo) {
			window.scrollTo(0, 0);
			setLoading(true);

			api.post("/create_ticket_event", request)
				.then((res) => {
					if (res.status === 201) {
						onSuccess(res.data);
					} else {
						onError(res.data);
					}
				})
				.catch((err) => {
					onError(err.message);
				});
		}
	}
	function onBack() {
		if (currentStep === CreateEventFlow.TicketInfo) {
			window.scrollTo(0, 0);
			setCurrentStep(CreateEventFlow.AdditionalInfo);
		}
		if (currentStep === CreateEventFlow.AdditionalInfo) {
			window.scrollTo(0, 0);
			setCurrentStep(CreateEventFlow.GeneralInfo);
		}
		if (currentStep === CreateEventFlow.GeneralInfo) {
			navigate(-1);
		}
	}
	function onError(data: any) {
		setLoading(false);
		setPreviousStep(currentStep);
		setCurrentStep(CreateEventFlow.Error);
	}
	function onSuccess(data: any) {
		setLoading(false);
		setPreviousStep(currentStep);
		setCurrentStep(CreateEventFlow.Done);
	}
	return (
		<div className="mx-44 my-16 flex flex-col items-center">
			{loading && <Loader />}
			{(currentStep === CreateEventFlow.GeneralInfo ||
				currentStep === CreateEventFlow.AdditionalInfo ||
				currentStep === CreateEventFlow.TicketInfo) && (
				<div
					className={
						"mb-[10px] flex h-[30px] w-full flex-row items-center justify-between whitespace-nowrap text-left text-center font-custom text-regular font-normal text-fangarde-black"
					}
				>
					<h2
						className={
							currentStep === CreateEventFlow.GeneralInfo
								? "border-b-4 border-b-medium-blue text-medium-blue"
								: undefined
						}
					>
						1. General Event Information
					</h2>
					<h2
						className={
							currentStep === CreateEventFlow.AdditionalInfo
								? "border-b-4 border-b-medium-blue text-medium-blue"
								: undefined
						}
					>
						2. Additional Event Information
					</h2>
					<h2
						className={
							currentStep === CreateEventFlow.TicketInfo
								? "border-b-4 border-b-medium-blue text-medium-blue"
								: undefined
						}
					>
						3. Ticket Information
					</h2>
				</div>
			)}
			{currentStep === CreateEventFlow.GeneralInfo && (
				<GeneralEventInfo
					onContinue={onContinue}
					event={request.event}
					setEvent={(value: any) => setRequest({ ...request, event: value })}
					onBack={onBack}
				/>
			)}
			{currentStep === CreateEventFlow.AdditionalInfo && (
				<AdditionalEventInfo
					onSubmit={onSubmit}
					onBack={onBack}
					event={request.event}
					setEvent={(value: any) => setRequest({ ...request, event: value })}
				/>
			)}
			{currentStep === CreateEventFlow.Done && <CreateEventDone />}
			{currentStep === CreateEventFlow.Error && (
				<CreateEventError
					onBack={() => {
						setCurrentStep(previousStep);
					}}
				/>
			)}
			{currentStep === CreateEventFlow.TicketInfo && (
				<TicketInfo onSubmit={onSubmit} onBack={onBack} request={request} setRequest={setRequest} />
			)}
		</div>
	);
};

export default CreateEvent;
