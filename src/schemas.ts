import { z } from "zod";

// ── Helpers ──────────────────────────────────────────────────────────

export const withData = <T extends z.ZodTypeAny>(schema: T) =>
	z.object({ data: schema }).transform((r) => (r as { data: z.infer<T> }).data);

export const withDataArray = <T extends z.ZodTypeAny>(schema: T) =>
	z.object({ data: z.array(schema) }).transform((r) => (r as { data: z.infer<T>[] }).data);

// ── Query parameters ─────────────────────────────────────────────────

export const QueryParams = z.record(z.string(), z.any());
export type QueryParams = z.infer<typeof QueryParams>;

export const JsonPatchOperationSchema = z.object({
	op: z.enum(["add", "remove", "replace", "copy", "move", "test"]),
	path: z.string(),
	value: z.any().optional(),
	from: z.string().optional(),
});
export type JsonPatchOperation = z.infer<typeof JsonPatchOperationSchema>;

export const JsonPatchSchema = z.array(JsonPatchOperationSchema);
export type JsonPatch = z.infer<typeof JsonPatchSchema>;

/**
 * Helper to convert a partial object to JSON Patch 'replace' operations.
 * Note: This only handles top-level fields.
 */
export function toReplacePatch<T extends Record<string, unknown>>(obj: T): JsonPatch {
	return Object.entries(obj).map(([key, value]) => ({
		op: "replace",
		path: `/${key}`,
		value,
	}));
}

// ── Async ────────────────────────────────────────────────────────────

export const AsyncStatusSchema = z.object({
	progress: z.number(),
	status: z.enum(["PENDING", "RUNNING", "IN_PROGRESS", "FINISHED", "FAILED"]),
	message: z.string(),
});
export type AsyncStatus = z.infer<typeof AsyncStatusSchema>;

// ── Subscriptions ────────────────────────────────────────────────────

export const SubscriptionSchema = z.object({
	reference: z.string(),
	event: z.string(),
	url: z.string(),
	filterStatus: z.string().optional(),
	filterRunStatus: z.string().optional(),
	enabled: z.boolean(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

export const SubscriptionsListSchema = withDataArray(SubscriptionSchema);

export const SubscriptionCreateSchema = z.object({
	event: z.string(),
	url: z.string(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type SubscriptionCreateRequest = z.infer<typeof SubscriptionCreateSchema>;

export const SubscriptionUpdateSchema = z.object({
	event: z.string().optional(),
	url: z.string().optional(),
	headers: z.record(z.string(), z.string()).optional(),
	enabled: z.boolean().optional(),
	status: z.string().optional(),
});
export type SubscriptionUpdateRequest = z.infer<typeof SubscriptionUpdateSchema>;

export const SubscriptionLogEntrySchema = z.object({
	responseCode: z.number(),
	event: z.string(),
	dateTime: z.string(),
	payload: z.string(),
	response: z.string(),
});
export type SubscriptionLogEntry = z.infer<typeof SubscriptionLogEntrySchema>;

export const SubscriptionLogSchema = withDataArray(SubscriptionLogEntrySchema);

// ── Orders ───────────────────────────────────────────────────────────

export const CustomerLocationSchema = z.object({
	referenceNumber: z.string(),
	name: z.string().optional(),
	address: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	w3wAddress: z.string().optional(),
});

export const WidgetTrackingSchema = z.object({
	trackingId: z.string(),
	externalTrackingUri: z.string(),
});

export const OrderSummarySchema = z.object({
	referenceNumber: z.string(),
	consignmentReference: z.string().optional(),
	distributionCentreReference: z.string(),
	distributionCentreName: z.string().optional(),
	task: z.enum(["DELIVERY", "COLLECTION"]).optional(),
	priority: z.enum(["NORMAL", "MEDIUM", "HIGH"]).optional(),
	clientName: z.string().optional(),
	contactPerson: z.string().optional(),
	customerLocation: CustomerLocationSchema,
	capacity1: z.number().optional(),
	capacity2: z.number().optional(),
	operationDuration: z.number().optional(),
	customFields: z.record(z.string(), z.string()).optional(),
	status: z.string().optional(),
	statusLastUpdated: z.string().optional(),
	widgetTrackingDetails: WidgetTrackingSchema.optional(),
});
export type OrderSummary = z.infer<typeof OrderSummarySchema>;

export const PaginatedOrdersSchema = z.object({
	offset: z.number(),
	_links: z.object({
		prev: z.string().optional(),
		next: z.string().optional(),
		first: z.string().optional(),
		last: z.string().optional(),
		self: z.string().optional(),
	}),
	data: z.array(OrderSummarySchema),
});
export type PaginatedOrders = z.infer<typeof PaginatedOrdersSchema>;

const NotificationPreferencesSchema = z.object({
	allowSMS: z.boolean().optional(),
	allowEmail: z.boolean().optional(),
});

const TimeWindowSchema = z.object({
	start: z.string(),
	end: z.string(),
});

export const OrderItemSchema = z.object({
	itemReferenceNumber: z.string(),
	orderReferenceNumber: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	barcode: z.string().optional(),
	type: z.string().optional(),
	status: z.string().optional(),
	rejectReason: z.string().optional(),
	rejectComment: z.string().optional(),
	pricePerUnit: z.number().optional(),
	plannedQuantity: z.number(),
	factQuantity: z.number().optional(),
	totalAmount: z.number().optional(),
	height: z.number().optional(),
	width: z.number().optional(),
	length: z.number().optional(),
	weight: z.number().optional(),
	volume: z.number().optional(),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
	referenceNumber: z.string(),
	consignmentReference: z.string().optional(),
	distributionCentreReference: z.string(),
	distributionCentreName: z.string().optional(),
	task: z.enum(["DELIVERY", "COLLECTION"]).optional(),
	priority: z.enum(["NORMAL", "MEDIUM", "HIGH"]).optional(),
	vehicleRequirements: z.array(z.string()).optional(),
	additionalInstructions: z.string().optional(),
	clientName: z.string().optional(),
	contactPerson: z.string().optional(),
	contactNumber: z.string().optional(),
	contactEmail: z.string().optional(),
	additionalContactEmails: z.array(z.string()).optional(),
	notificationPreferences: NotificationPreferencesSchema.optional(),
	customerLocation: CustomerLocationSchema,
	territoryReference: z.string().optional(),
	stopSequence: z.string().optional(),
	timeWindows: z.array(TimeWindowSchema).optional(),
	orderDate: z.string(),
	capacity1: z.number().optional(),
	capacity2: z.number().optional(),
	price: z.number().optional(),
	operationDuration: z.number().optional(),
	customFields: z.record(z.string(), z.string()).optional(),
	orderItems: z.array(OrderItemSchema).optional(),
});
export type Order = z.infer<typeof OrderSchema>;

export const OrderCreateSchema = OrderSchema;
export type OrderCreateRequest = z.infer<typeof OrderCreateSchema>;

export const OrderAttachmentsSchema = withData(
	z.object({
		orderReferenceNumber: z.string(),
		attachments: z.array(
			z.object({
				attachmentReferenceNumber: z.string(),
				orderReferenceNumber: z.string(),
				comment: z.string().optional(),
				imageSmall: z.string(),
				imageFull: z.string(),
			}),
		),
	}),
);
export type OrderAttachments = z.infer<typeof OrderAttachmentsSchema>;

export const OrderExecutionSchema = withData(
	z.object({
		orderReferenceNumber: z.string(),
		assignedDriverReference: z.string().optional(),
		assignedDriverName: z.string().optional(),
		assignedVehicleReference: z.string().optional(),
		assignedVehicleName: z.string().optional(),
		plannedArrivalTime: z.string().optional(),
		plannedCompletionTime: z.string().optional(),
		stopNumber: z.number().optional(),
		totalStopsInRun: z.number().optional(),
		runNumber: z.number().optional(),
		runReference: z.string().optional(),
		eta: z.string().optional(),
		factArrivalTimeGPS: z.string().optional(),
		factCompletionTimeGPS: z.string().optional(),
		factArrivalTimeReported: z.string().optional(),
		factCompletionTimeReported: z.string().optional(),
		failReason: z.string().optional(),
		failComment: z.string().optional(),
		status: z.string(),
	}),
);
export type OrderExecution = z.infer<typeof OrderExecutionSchema>;

export const OrderItemsResponseSchema = withData(
	z.object({
		orderReferenceNumber: z.string(),
		orderItems: z.array(OrderItemSchema),
		plannedItemsCount: z.number(),
		factItemsCount: z.number(),
		ItemsStatus: z.string(),
	}),
);
export type OrderItemsResponse = z.infer<typeof OrderItemsResponseSchema>;

export const OrderLoadingSchema = withData(
	z.object({
		orderReferenceNumber: z.string(),
		orderLoadingStatus: z.string(),
		orderItemsLoading: z.array(
			z.object({
				name: z.string().optional(),
				barcode: z.string().optional(),
				quantity: z.number(),
				loadedQuantity: z.number(),
				loadingStatus: z.string(),
			}),
		),
	}),
);
export type OrderLoading = z.infer<typeof OrderLoadingSchema>;

export const WidgetSchema = withData(
	z.object({
		trackingId: z.string(),
		externalTrackingUri: z.string(),
	}),
);
export type Widget = z.infer<typeof WidgetSchema>;

export const PODSchema = withData(
	z.object({
		orderReferenceNumber: z.string(),
		signatoryName: z.string().optional(),
		signatureTime: z.string().optional(),
		signatureImage: z.string().optional(),
	}),
);
export type POD = z.infer<typeof PODSchema>;

export const TrackingInfoSchema = withData(
	z.object({
		orderReferenceNumber: z.string(),
		currentPosition: z
			.object({
				latitude: z.number(),
				longitude: z.number(),
			})
			.optional(),
		status: z.string(),
	}),
);
export type TrackingInfo = z.infer<typeof TrackingInfoSchema>;

export const OrderDeleteResponseSchema = z
	.object({
		warnings: z
			.object({
				code: z.string(),
				name: z.string(),
				details: z.string(),
				field: z.string(),
			})
			.optional(),
	})
	.optional();
export type OrderDeleteResponse = z.infer<typeof OrderDeleteResponseSchema>;

// ── Drivers ──────────────────────────────────────────────────────────

export const DriverSummarySchema = z.object({
	referenceNumber: z.string(),
	name: z.string(),
	assignedVehicleReference: z.string().optional(),
	assignedVehicleName: z.string().optional(),
	distributionCentreReference: z.string().optional(),
	distributionCentreName: z.string().optional(),
});
export type DriverSummary = z.infer<typeof DriverSummarySchema>;

export const DriversListSchema = z.object({
	offset: z.number(),
	_links: z.object({
		prev: z.string().optional(),
		next: z.string().optional(),
	}),
	data: z.array(DriverSummarySchema),
});
export type DriversList = z.infer<typeof DriversListSchema>;

export const DriverSchema = z.object({
	referenceNumber: z.string(),
	name: z.string(),
	comment: z.string().optional(),
	telephone: z.string().optional(),
	assignedVehicleReference: z.string().optional(),
	assignedVehicleName: z.string().optional(),
	costPerHour: z.number().optional(),
	distributionCentreReference: z.string().optional(),
	distributionCentreName: z.string().optional(),
	territories: z.array(z.string()).optional(),
	startOfDayLocation: z.string().optional(),
	startOfDayAddress: z.string().optional(),
	visitDistributionCentreStart: z.string().optional(),
	endOfDayLocation: z.string().optional(),
	endOfDayAddress: z.string().optional(),
	visitDistributionCentreEnd: z.string().optional(),
	drivingLimit: z.number().optional(),
	runDurationLimit: z.number().optional(),
	dutyTimeLimit: z.number().optional(),
	availability: z
		.record(
			z.string(),
			z.object({
				startDay: z.string().optional(),
				startTime: z.string(),
				rigidStart: z.boolean().optional(),
				endDay: z.string().optional(),
				endTime: z.string(),
			}),
		)
		.optional(),
});
export type Driver = z.infer<typeof DriverSchema>;

export const DriverCreateSchema = z.object({
	name: z.string(),
	telephone: z.string().optional(),
	assignedVehicleReference: z.string().optional(),
	distributionCentreReference: z.string().optional(),
	costPerHour: z.number().optional(),
});
export type DriverCreateRequest = z.infer<typeof DriverCreateSchema>;

// ── Vehicles ─────────────────────────────────────────────────────────

export const VehicleSummarySchema = z.object({
	referenceNumber: z.string(),
	name: z.string().optional(),
	capacity1: z.number().optional(),
	capacity2: z.number().optional(),
	distributionCentreReference: z.string().optional(),
	distributionCentreName: z.string().optional(),
	vehicleTypeReference: z.string().optional(),
	assignedDriverReference: z.string().optional(),
	assignedDriverName: z.string().optional(),
});
export type VehicleSummary = z.infer<typeof VehicleSummarySchema>;

export const VehiclesListSchema = z.object({
	offset: z.number(),
	_links: z.object({
		prev: z.string().optional(),
		next: z.string().optional(),
	}),
	data: z.array(VehicleSummarySchema),
});
export type VehiclesList = z.infer<typeof VehiclesListSchema>;

export const VehicleSchema = z.object({
	referenceNumber: z.string(),
	name: z.string().optional(),
	assignedDevice: z.string().optional(),
	trackingSource: z.string().optional(),
	vehicleRequirementsReferences: z.array(z.string()).optional(),
	vehicleTypeReference: z.string().optional(),
	maxSpeed: z.number().optional(),
	drivingTimeCorrectionFactor: z.number().optional(),
	costPerDistance: z.number().optional(),
	activationCost: z.number().optional(),
	costPerOrder: z.number().optional(),
	capacity1: z.number().optional(),
	capacity2: z.number().optional(),
	runDistanceLimit: z.number().optional(),
	distributionCentreReference: z.string().optional(),
	distributionCentreName: z.string().optional(),
	assignedDriverReference: z.string().optional(),
	assignedDriverName: z.string().optional(),
	territoriesReferences: z.array(z.string()).optional(),
	comment: z.string().optional(),
	manufacturer: z.string().optional(),
	VIN: z.string().optional(),
	isStandDown: z.boolean().optional(),
	isArchived: z.boolean().optional(),
	color: z.string().optional(),
});
export type Vehicle = z.infer<typeof VehicleSchema>;

export const VehicleCreateSchema = z.object({
	referenceNumber: z.string(),
	name: z.string().optional(),
	capacity1: z.number().optional(),
	capacity2: z.number().optional(),
	distributionCentreReference: z.string().optional(),
	vehicleTypeReference: z.string().optional(),
});
export type VehicleCreateRequest = z.infer<typeof VehicleCreateSchema>;

// ── Locations ────────────────────────────────────────────────────────

export const LocationSummarySchema = z.object({
	referenceNumber: z.string(),
	name: z.string().optional(),
	address: z.string(),
	w3wAddress: z.string().optional(),
	postcode: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	clientName: z.string().optional(),
	isVerified: z.boolean().optional(),
	isValid: z.boolean().optional(),
	created: z.string().optional(),
	updated: z.string().optional(),
});
export type LocationSummary = z.infer<typeof LocationSummarySchema>;

export const LocationsListSchema = z.object({
	offset: z.number(),
	_links: z.object({
		prev: z.string().optional(),
		next: z.string().optional(),
	}),
	data: z.array(LocationSummarySchema),
});
export type LocationsList = z.infer<typeof LocationsListSchema>;

const LocationSettingsSchema = z.object({
	allowSMS: z.boolean().optional(),
	allowEmail: z.boolean().optional(),
	fixedTimePerAddress: z.number().optional(),
	fixedTimePerOrder: z.number().optional(),
	timePerCapacityDelivery: z.number().optional(),
	preferredDriverReferences: z.array(z.string()).optional(),
	preferredDriverNames: z.array(z.string()).optional(),
	vehicleRequirementsReferences: z.array(z.string()).optional(),
});

const DayTimeWindowSchema = z.object({
	start: z.string(),
	end: z.string(),
});

export const LocationSchema = z.object({
	referenceNumber: z.string(),
	name: z.string().optional(),
	address: z.string(),
	w3wAddress: z.string().optional(),
	postcode: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	clientName: z.string().optional(),
	isVerified: z.boolean().optional(),
	isValid: z.boolean().optional(),
	created: z.string().optional(),
	updated: z.string().optional(),
	description: z.string().optional(),
	primaryTelephone: z.string().optional(),
	secondaryTelephone: z.string().optional(),
	email: z.string().optional(),
	website: z.string().optional(),
	settings: LocationSettingsSchema.optional(),
	availability: z.record(z.string(), DayTimeWindowSchema).optional(),
});
export type Location = z.infer<typeof LocationSchema>;

export const LocationCreateSchema = z.object({
	referenceNumber: z.string(),
	name: z.string().optional(),
	address: z.string(),
	w3wAddress: z.string().optional(),
	postcode: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	clientName: z.string().optional(),
	description: z.string().optional(),
	primaryTelephone: z.string().optional(),
	secondaryTelephone: z.string().optional(),
	email: z.string().optional(),
	website: z.string().optional(),
});
export type LocationCreateRequest = z.infer<typeof LocationCreateSchema>;

// ── Distribution Centres ─────────────────────────────────────────────

export const DistributionCentreSchema = z.object({
	referenceNumber: z.string(),
	name: z.string(),
	address: z.string().optional(),
});
export type DistributionCentre = z.infer<typeof DistributionCentreSchema>;

export const DistributionCentresListSchema = z.object({
	offset: z.number(),
	_links: z.object({
		prev: z.string().optional(),
		next: z.string().optional(),
	}),
	data: z.array(DistributionCentreSchema),
});
export type DistributionCentresList = z.infer<typeof DistributionCentresListSchema>;

// ── Runs ─────────────────────────────────────────────────────────────

export const RunLoadingInfoSchema = withData(
	z.object({
		runReference: z.string(),
		runLoadingStatus: z.string(),
		ordersLoading: z.array(
			z.object({
				orderReference: z.string(),
				orderLoadingStatus: z.string(),
			}),
		),
	}),
);
export type RunLoadingInfo = z.infer<typeof RunLoadingInfoSchema>;

// ── Schedule / Shifts ────────────────────────────────────────────────

const AllocationSchema = z.object({
	orderReference: z.string(),
	customerLocationName: z.string().optional(),
	customerLocationAddress: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	plannedDrivingStartTime: z.string().optional(),
	plannedArrivalTime: z.string().optional(),
	plannedCompletionTime: z.string().optional(),
	status: z.string(),
	sequenceNumber: z.number().optional(),
	task: z.string().optional(),
});

const RunSchema = z.object({
	plannedLoadingStartTime: z.string().optional(),
	plannedDepartureTime: z.string().optional(),
	plannedReturnStartTime: z.string().optional(),
	plannedCompletionTime: z.string().optional(),
	totalOrders: z.number().optional(),
	totalDuration: z.number().optional(),
	totalDistance: z.number().optional(),
	totalCapacity1: z.number().optional(),
	totalCapacity2: z.number().optional(),
	allocations: z.array(AllocationSchema).optional(),
	isLocked: z.boolean().optional(),
	reference: z.string(),
	runNumber: z.number().optional(),
	totalDeliveries: z.number().optional(),
	totalCollections: z.number().optional(),
});

const DriverShiftSchema = z.object({
	driverName: z.string(),
	driverReference: z.string(),
	vehicleName: z.string().optional(),
	vehicleReference: z.string(),
	shiftDate: z.string(),
	shiftStartTime: z.string(),
	shiftEndTime: z.string(),
	runs: z.array(RunSchema),
	totalWorkingTime: z.number().optional(),
	totalDrivingTime: z.number().optional(),
	totalDistance: z.number().optional(),
});

export const ScheduleResponseSchema = z.object({
	driverShifts: z.array(DriverShiftSchema),
});
export type ScheduleResponse = z.infer<typeof ScheduleResponseSchema>;

// ── Async operation response ─────────────────────────────────────────

export const UnallocateResponseSchema = z.object({
	taskReference: z.string(),
	operationReference: z.string(),
});
export type UnallocateResponse = z.infer<typeof UnallocateResponseSchema>;
