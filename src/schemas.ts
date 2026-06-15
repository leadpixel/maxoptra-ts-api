import { z } from "zod";

// ── Helpers ──────────────────────────────────────────────────────────

export const withData = <T extends z.ZodTypeAny>(schema: T) =>
	z.object({ data: schema }).transform((r) => (r as { data: z.infer<T> }).data);

export const withDataArray = <T extends z.ZodTypeAny>(schema: T) =>
	z.object({ data: z.array(schema) }).transform((r) => (r as { data: z.infer<T>[] }).data);

// ── Query parameters ─────────────────────────────────────────────────

export const QueryParams = z.record(z.string(), z.unknown());
export type QueryParams = z.infer<typeof QueryParams>;

export const JsonPatchOperationSchema = z.object({
	op: z.enum(["add", "remove", "replace", "copy", "move", "test"]),
	path: z.string(),
	value: z.unknown().nullable().optional(),
	from: z.string().nullable().optional(),
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
	filterStatus: z.string().nullable().optional(),
	filterRunStatus: z.string().nullable().optional(),
	enabled: z.boolean(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

export const SubscriptionsListSchema = withDataArray(SubscriptionSchema);

export const SubscriptionCreateSchema = z.object({
	event: z.string(),
	url: z.string(),
	headers: z.record(z.string(), z.string()).nullable().optional(),
});
export type SubscriptionCreateRequest = z.infer<typeof SubscriptionCreateSchema>;

export const SubscriptionUpdateSchema = z.object({
	event: z.string().nullable().optional(),
	url: z.string().nullable().optional(),
	headers: z.record(z.string(), z.string()).nullable().optional(),
	enabled: z.boolean().nullable().optional(),
	status: z.string().nullable().optional(),
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
	name: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
	w3wAddress: z.string().nullable().optional(),
});

export const WidgetTrackingSchema = z.object({
	trackingId: z.string(),
	externalTrackingUri: z.string(),
});

export const OrderSummarySchema = z.object({
	referenceNumber: z.string(),
	consignmentReference: z.string().nullable().optional(),
	distributionCentreReference: z.string(),
	distributionCentreName: z.string().nullable().optional(),
	task: z.enum(["DELIVERY", "COLLECTION"]).nullable().optional(),
	priority: z.enum(["NORMAL", "MEDIUM", "HIGH"]).nullable().optional(),
	clientName: z.string().nullable().optional(),
	contactPerson: z.string().nullable().optional(),
	customerLocation: CustomerLocationSchema,
	capacity1: z.number().nullable().optional(),
	capacity2: z.number().nullable().optional(),
	operationDuration: z.number().nullable().optional(),
	customFields: z.record(z.string(), z.string()).nullable().optional(),
	status: z.string().nullable().optional(),
	statusLastUpdated: z.string().nullable().optional(),
	widgetTrackingDetails: WidgetTrackingSchema.nullable().optional(),
});
export type OrderSummary = z.infer<typeof OrderSummarySchema>;

export const PaginatedOrdersSchema = z.object({
	offset: z.number(),
	_links: z.object({
		prev: z.string().nullable().optional(),
		next: z.string().nullable().optional(),
		first: z.string().nullable().optional(),
		last: z.string().nullable().optional(),
		self: z.string().nullable().optional(),
	}),
	data: z.array(OrderSummarySchema),
});
export type PaginatedOrders = z.infer<typeof PaginatedOrdersSchema>;

const NotificationPreferencesSchema = z.object({
	allowSMS: z.boolean().nullable().optional(),
	allowEmail: z.boolean().nullable().optional(),
});

const TimeWindowSchema = z.object({
	start: z.string(),
	end: z.string(),
});

export const OrderItemSchema = z.object({
	itemReferenceNumber: z.string(),
	orderReferenceNumber: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	barcode: z.string().nullable().optional(),
	type: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	rejectReason: z.string().nullable().optional(),
	rejectComment: z.string().nullable().optional(),
	pricePerUnit: z.number().nullable().optional(),
	plannedQuantity: z.number(),
	factQuantity: z.number().nullable().optional(),
	totalAmount: z.number().nullable().optional(),
	height: z.number().nullable().optional(),
	width: z.number().nullable().optional(),
	length: z.number().nullable().optional(),
	weight: z.number().nullable().optional(),
	volume: z.number().nullable().optional(),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
	referenceNumber: z.string(),
	consignmentReference: z.string().nullable().optional(),
	distributionCentreReference: z.string(),
	distributionCentreName: z.string().nullable().optional(),
	task: z.enum(["DELIVERY", "COLLECTION"]).nullable().optional(),
	priority: z.enum(["NORMAL", "MEDIUM", "HIGH"]).nullable().optional(),
	vehicleRequirements: z.array(z.string()).nullable().optional(),
	additionalInstructions: z.string().nullable().optional(),
	clientName: z.string().nullable().optional(),
	contactPerson: z.string().nullable().optional(),
	contactNumber: z.string().nullable().optional(),
	contactEmail: z.string().nullable().optional(),
	additionalContactEmails: z.array(z.string()).nullable().optional(),
	notificationPreferences: NotificationPreferencesSchema.nullable().optional(),
	customerLocation: CustomerLocationSchema,
	territoryReference: z.string().nullable().optional(),
	stopSequence: z.string().nullable().optional(),
	timeWindows: z.array(TimeWindowSchema).nullable().optional(),
	orderDate: z.string(),
	capacity1: z.number().nullable().optional(),
	capacity2: z.number().nullable().optional(),
	price: z.number().nullable().optional(),
	operationDuration: z.number().nullable().optional(),
	customFields: z.record(z.string(), z.string()).nullable().optional(),
	orderItems: z.array(OrderItemSchema).nullable().optional(),
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
				comment: z.string().nullable().optional(),
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
		assignedDriverReference: z.string().nullable().optional(),
		assignedDriverName: z.string().nullable().optional(),
		assignedVehicleReference: z.string().nullable().optional(),
		assignedVehicleName: z.string().nullable().optional(),
		plannedArrivalTime: z.string().nullable().optional(),
		plannedCompletionTime: z.string().nullable().optional(),
		stopNumber: z.number().nullable().optional(),
		totalStopsInRun: z.number().nullable().optional(),
		runNumber: z.number().nullable().optional(),
		runReference: z.string().nullable().optional(),
		eta: z.string().nullable().optional(),
		factArrivalTimeGPS: z.string().nullable().optional(),
		factCompletionTimeGPS: z.string().nullable().optional(),
		factArrivalTimeReported: z.string().nullable().optional(),
		factCompletionTimeReported: z.string().nullable().optional(),
		failReason: z.string().nullable().optional(),
		failComment: z.string().nullable().optional(),
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
		// biome-ignore lint/style/useNamingConvention: API defined field
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
				name: z.string().nullable().optional(),
				barcode: z.string().nullable().optional(),
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

export const PodSchema = withData(
	z.object({
		orderReferenceNumber: z.string(),
		signatoryName: z.string().nullable().optional(),
		signatureTime: z.string().nullable().optional(),
		signatureImage: z.string().nullable().optional(),
	}),
);
export type Pod = z.infer<typeof PodSchema>;

export const TrackingInfoSchema = withData(
	z.object({
		orderReferenceNumber: z.string(),
		currentPosition: z
			.object({
				latitude: z.number(),
				longitude: z.number(),
			})
			.nullable()
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
			.nullable()
			.optional(),
	})
	.nullable()
	.optional();
export type OrderDeleteResponse = z.infer<typeof OrderDeleteResponseSchema>;

// ── Drivers ──────────────────────────────────────────────────────────

export const DriverSummarySchema = z.object({
	referenceNumber: z.string(),
	name: z.string(),
	assignedVehicleReference: z.string().nullable().optional(),
	assignedVehicleName: z.string().nullable().optional(),
	distributionCentreReference: z.string().nullable().optional(),
	distributionCentreName: z.string().nullable().optional(),
});
export type DriverSummary = z.infer<typeof DriverSummarySchema>;

export const DriversListSchema = z.object({
	offset: z.number(),
	_links: z.object({
		prev: z.string().nullable().optional(),
		next: z.string().nullable().optional(),
	}),
	data: z.array(DriverSummarySchema),
});
export type DriversList = z.infer<typeof DriversListSchema>;

export const DriverSchema = z.object({
	referenceNumber: z.string(),
	name: z.string(),
	comment: z.string().nullable().optional(),
	telephone: z.string().nullable().optional(),
	assignedVehicleReference: z.string().nullable().optional(),
	assignedVehicleName: z.string().nullable().optional(),
	costPerHour: z.number().nullable().optional(),
	distributionCentreReference: z.string().nullable().optional(),
	distributionCentreName: z.string().nullable().optional(),
	territories: z.array(z.string()).nullable().optional(),
	startOfDayLocation: z.string().nullable().optional(),
	startOfDayAddress: z.string().nullable().optional(),
	visitDistributionCentreStart: z.string().nullable().optional(),
	endOfDayLocation: z.string().nullable().optional(),
	endOfDayAddress: z.string().nullable().optional(),
	visitDistributionCentreEnd: z.string().nullable().optional(),
	drivingLimit: z.number().nullable().optional(),
	runDurationLimit: z.number().nullable().optional(),
	dutyTimeLimit: z.number().nullable().optional(),
	availability: z
		.record(
			z.string(),
			z.object({
				startDay: z.string().nullable().optional(),
				startTime: z.string(),
				rigidStart: z.boolean().nullable().optional(),
				endDay: z.string().nullable().optional(),
				endTime: z.string(),
			}),
		)
		.nullable()
		.optional(),
});
export type Driver = z.infer<typeof DriverSchema>;

export const DriverCreateSchema = z.object({
	name: z.string(),
	telephone: z.string().nullable().optional(),
	assignedVehicleReference: z.string().nullable().optional(),
	distributionCentreReference: z.string().nullable().optional(),
	costPerHour: z.number().nullable().optional(),
});
export type DriverCreateRequest = z.infer<typeof DriverCreateSchema>;

// ── Vehicles ─────────────────────────────────────────────────────────

export const VehicleSummarySchema = z.object({
	referenceNumber: z.string(),
	name: z.string().nullable().optional(),
	capacity1: z.number().nullable().optional(),
	capacity2: z.number().nullable().optional(),
	distributionCentreReference: z.string().nullable().optional(),
	distributionCentreName: z.string().nullable().optional(),
	vehicleTypeReference: z.string().nullable().optional(),
	assignedDriverReference: z.string().nullable().optional(),
	assignedDriverName: z.string().nullable().optional(),
});
export type VehicleSummary = z.infer<typeof VehicleSummarySchema>;

export const VehiclesListSchema = z.object({
	offset: z.number(),
	_links: z.object({
		prev: z.string().nullable().optional(),
		next: z.string().nullable().optional(),
	}),
	data: z.array(VehicleSummarySchema),
});
export type VehiclesList = z.infer<typeof VehiclesListSchema>;

export const VehicleSchema = z.object({
	referenceNumber: z.string(),
	name: z.string().nullable().optional(),
	assignedDevice: z.string().nullable().optional(),
	trackingSource: z.string().nullable().optional(),
	vehicleRequirementsReferences: z.array(z.string()).nullable().optional(),
	vehicleTypeReference: z.string().nullable().optional(),
	maxSpeed: z.number().nullable().optional(),
	drivingTimeCorrectionFactor: z.number().nullable().optional(),
	costPerDistance: z.number().nullable().optional(),
	activationCost: z.number().nullable().optional(),
	costPerOrder: z.number().nullable().optional(),
	capacity1: z.number().nullable().optional(),
	capacity2: z.number().nullable().optional(),
	runDistanceLimit: z.number().nullable().optional(),
	distributionCentreReference: z.string().nullable().optional(),
	distributionCentreName: z.string().nullable().optional(),
	assignedDriverReference: z.string().nullable().optional(),
	assignedDriverName: z.string().nullable().optional(),
	territoriesReferences: z.array(z.string()).nullable().optional(),
	comment: z.string().nullable().optional(),
	manufacturer: z.string().nullable().optional(),
	// biome-ignore lint/style/useNamingConvention: API defined field
	VIN: z.string().nullable().optional(),
	isStandDown: z.boolean().nullable().optional(),
	isArchived: z.boolean().nullable().optional(),
	color: z.string().nullable().optional(),
});
export type Vehicle = z.infer<typeof VehicleSchema>;

export const VehicleCreateSchema = z.object({
	referenceNumber: z.string(),
	name: z.string().nullable().optional(),
	capacity1: z.number().nullable().optional(),
	capacity2: z.number().nullable().optional(),
	distributionCentreReference: z.string().nullable().optional(),
	vehicleTypeReference: z.string().nullable().optional(),
});
export type VehicleCreateRequest = z.infer<typeof VehicleCreateSchema>;

// ── Locations ────────────────────────────────────────────────────────

export const LocationSummarySchema = z.object({
	referenceNumber: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	address: z.string(),
	w3wAddress: z.string().nullable().optional(),
	postcode: z.string().nullable().optional(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
	clientName: z.string().nullable().optional(),
	isVerified: z.boolean().nullable().optional(),
	isValid: z.boolean().nullable().optional(),
	created: z.string().nullable().optional(),
	updated: z.string().nullable().optional(),
});
export type LocationSummary = z.infer<typeof LocationSummarySchema>;

export const LocationsListSchema = z.object({
	offset: z.number(),
	_links: z.object({
		prev: z.string().nullable().optional(),
		next: z.string().nullable().optional(),
	}),
	data: z.array(LocationSummarySchema),
});
export type LocationsList = z.infer<typeof LocationsListSchema>;

const LocationSettingsSchema = z.object({
	allowSMS: z.boolean().nullable().optional(),
	allowEmail: z.boolean().nullable().optional(),
	fixedTimePerAddress: z.number().nullable().optional(),
	fixedTimePerOrder: z.number().nullable().optional(),
	timePerCapacityDelivery: z.number().nullable().optional(),
	preferredDriverReferences: z.array(z.string()).nullable().optional(),
	preferredDriverNames: z.array(z.string()).nullable().optional(),
	vehicleRequirementsReferences: z.array(z.string()).nullable().optional(),
});

const DayTimeWindowSchema = z.object({
	start: z.string(),
	end: z.string(),
});

export const LocationSchema = z.object({
	referenceNumber: z.string(),
	name: z.string().nullable().optional(),
	address: z.string(),
	w3wAddress: z.string().nullable().optional(),
	postcode: z.string().nullable().optional(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
	clientName: z.string().nullable().optional(),
	isVerified: z.boolean().nullable().optional(),
	isValid: z.boolean().nullable().optional(),
	created: z.string().nullable().optional(),
	updated: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	primaryTelephone: z.string().nullable().optional(),
	secondaryTelephone: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	website: z.string().nullable().optional(),
	settings: LocationSettingsSchema.nullable().optional(),
	availability: z.record(z.string(), DayTimeWindowSchema).nullable().optional(),
});
export type Location = z.infer<typeof LocationSchema>;

export const LocationCreateSchema = z.object({
	referenceNumber: z.string(),
	name: z.string().nullable().optional(),
	address: z.string(),
	w3wAddress: z.string().nullable().optional(),
	postcode: z.string().nullable().optional(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
	clientName: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	primaryTelephone: z.string().nullable().optional(),
	secondaryTelephone: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	website: z.string().nullable().optional(),
});
export type LocationCreateRequest = z.infer<typeof LocationCreateSchema>;

// ── Distribution Centres ─────────────────────────────────────────────

export const DistributionCentreSchema = z.object({
	referenceNumber: z.string(),
	name: z.string(),
	address: z.string().nullable().optional(),
});
export type DistributionCentre = z.infer<typeof DistributionCentreSchema>;

export const DistributionCentresListSchema = z.object({
	offset: z.number(),
	_links: z.object({
		prev: z.string().nullable().optional(),
		next: z.string().nullable().optional(),
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
	customerLocationName: z.string().nullable().optional(),
	customerLocationAddress: z.string().nullable().optional(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
	plannedDrivingStartTime: z.string().nullable().optional(),
	plannedArrivalTime: z.string().nullable().optional(),
	plannedCompletionTime: z.string().nullable().optional(),
	status: z.string(),
	sequenceNumber: z.number().nullable().optional(),
	task: z.string().nullable().optional(),
});

const RunSchema = z.object({
	plannedLoadingStartTime: z.string().nullable().optional(),
	plannedDepartureTime: z.string().nullable().optional(),
	plannedReturnStartTime: z.string().nullable().optional(),
	plannedCompletionTime: z.string().nullable().optional(),
	totalOrders: z.number().nullable().optional(),
	totalDuration: z.number().nullable().optional(),
	totalDistance: z.number().nullable().optional(),
	totalCapacity1: z.number().nullable().optional(),
	totalCapacity2: z.number().nullable().optional(),
	allocations: z.array(AllocationSchema).nullable().optional(),
	isLocked: z.boolean().nullable().optional(),
	reference: z.string(),
	runNumber: z.number().nullable().optional(),
	totalDeliveries: z.number().nullable().optional(),
	totalCollections: z.number().nullable().optional(),
});

const DriverShiftSchema = z.object({
	driverName: z.string(),
	driverReference: z.string(),
	vehicleName: z.string().nullable().optional(),
	vehicleReference: z.string(),
	shiftDate: z.string(),
	shiftStartTime: z.string(),
	shiftEndTime: z.string(),
	runs: z.array(RunSchema),
	totalWorkingTime: z.number().nullable().optional(),
	totalDrivingTime: z.number().nullable().optional(),
	totalDistance: z.number().nullable().optional(),
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
