/**
 * GraphQL Error type as returned by the GraphQL server
 */
export interface GraphQLError {
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, unknown>;
}

/**
 * Generic GraphQL result interface
 * All API responses follow this structure with data of type T
 */
export interface GraphQLResult<T> {
    data?: T;
    errors?: GraphQLError[];
}

/* ========= Enums ========= */

export enum VehicleAction {
    LOADING = "LOADING",
    UNLOADING = "UNLOADING",
    KEEPING = "KEEPING",
    CS_LOADING = "CS_LOADING",
    CS_UNLOADING = "CS_UNLOADING",
    CS_KEEPING = "CS_KEEPING",
}

export enum TrackingPointType {
    USER = "USER",
    API = "API",
    BPM = "BPM",
}

export enum OriginDestinationType {
    ArrivalFlight = "ArrivalFlight",
    DepartureFlight = "DepartureFlight",
    TransferFlight = "TransferFlight",
    SelectionList = "SelectionList",
    Custom = "Custom",
}

export enum FlightClass {
    FIRST = "FIRST",
    BUSINESS = "BUSINESS",
    PREMIUM_ECONOMY = "PREMIUM_ECONOMY",
    ECONOMY = "ECONOMY",
}

export enum ContainerType {
    BT = "BT",
    ULD = "ULD",
}

export enum ContainerTypePhysical {
    ULD = "ULD",
    CART = "CART",
}

export enum ContainerStatus {
    CREATED = "CREATED",
    PAIRED = "PAIRED",
    LOADED_TO_AIRCRAFT = "LOADED_TO_AIRCRAFT",
}

/* ========= Journey / Config Structures ========= */

export interface JourneyUI {
    icon: string;
    color: string;
    text_color: string;
    button_text: string;
    category_text: string;
}

export interface JourneyFlow {
    next_tracking_points: string[];
    is_initial: boolean;
    vehicle_action?: VehicleAction;
    no_of_images?: string[]; // Updated: now array of string (per new schema)
}

/* Selection Lists & Origin/Destination union */

export interface SelectionListItem {
    name: string;
    read_access: string[];
}

export interface SelectionList {
    name: string;
    origin_type: OriginDestinationType;
    icon: string;
    selection_list: SelectionListItem[];
}

export interface OriginDestinationBase {
    name: string;
    origin_type: OriginDestinationType;
    icon: string;
}

export type OriginDestination = OriginDestinationBase | SelectionList;

/* Tracking Point Config union */

export interface ITrackingPointConfig {
    type: TrackingPointType;
    status: string;
    status_name: string;
    location?: string;
    flow?: JourneyFlow;
    read_access: string[];
    full_access: string[];
}

export type TrackingPointConfigBase = ITrackingPointConfig; // alias (interface had no additional members)

export interface UserTrackingPointConfig extends ITrackingPointConfig {
    ui: JourneyUI;
}

export type TrackingPointConfigUnion =
    | TrackingPointConfigBase
    | UserTrackingPointConfig;

/* Journey Config */

export interface JourneyConfig {
    name: string;
    origin: OriginDestination;
    destination: OriginDestination;
    tracking_points: TrackingPointConfigUnion[];
}

/* ========= Core Domain Types ========= */

export interface TrackingPoint {
    bag_tag_no: string;
    tracking_point_id: string;
    journey: string;
    status: string;
    location?: string;
    bpm: string;
    timestamp: string;
    reverted: boolean;
    origin: string;
    origin_date: string;
    destination: string;
    destination_date: string;
    vehicle_action?: string;
    vehicle_number?: string;
    tracked_by?: string;
    damaged?: boolean;
    bag_images?: BagImage[];
    additional_data?: string; // AWSJSON
}

export interface BagImage {
    name: string;
    url: string;
    type: string;
}

export interface TrackedBag {
    bag_tag_no: string;
    journey: string;
    status: string;
    location?: string;
    updated_by?: string;
    last_updated: string;
    origin: string;
    origin_date: string;
    destination: string;
    destination_date: string;
    vehicle_number?: string;
    additional_data?: string; // AWSJSON
    bag_images?: BagImage[];
    damaged: boolean;
}

export interface Vehicle {
    vehicle_number?: string;
    journey?: string;
}

export interface IVehicle {
    journey: string;
    vehicle_number: string;
    number_of_bags: number;
    created_at: string;
}

export interface Transporter extends IVehicle {
    vehicle_number: string;
    journey: string;
    number_of_bags: number;
    created_at: string;
}

export interface ContainerSheet extends IVehicle {
    vehicle_number: string;
    journey: string;
    number_of_bags: number;
    created_at: string;
    container_sheet_id?: string;
    container_type?: ContainerType;
    origin?: string;
    origin_date?: string;
    destination?: string;
    destination_date?: string;
    flight_class?: FlightClass;
    container_status?: ContainerStatus;
    bt_number?: string;
    cargo_hold_number?: string;
    last_process_ts?: string;
    comment?: string;
}

export interface MenuItem {
    journey: string;
    status: string;
    category: string;
    menu_item: string;
    cognito_group?: string;
    ui?: JourneyUI;
    flow?: JourneyFlow;
}

/* Kept for limited backward compatibility (legacy concepts) */
export interface Journey {
    journey?: string;
    status?: string;
    status_name?: string;
    location?: string;
    flow?: JourneyFlow;
    ui?: JourneyUI;
    read_access?: string[];
    full_access?: string[];
}

export interface MessageHistoryFormat {
    ts?: string;
    message?: string;
    message_type?: string;
    bag_status?: string;
}

export interface LastUserUpdateTS {
    timestamp?: string;
    userId?: string;
}

export interface Bag {
    flight_no: string;
    scheduled_date: string;
    bag_tag_no: string;
    bag_journey: string;
    bag_message: string;
}

export interface StatusSummary {
    status?: string;
    bags?: TrackedBag[];
}

export interface TrackedBagsInformation {
    no_of_origins: number;
    no_of_destinations: number;
    status_summary: StatusSummary[];
}

/* ========= Form / UI Data ========= */

export interface BagTrackingData {
    bagTagNumber: string;
    origin: string;
    destination: string;
    journey?: string;
    status?: string;
    origin_date?: string;
    destination_date?: string;
    vehicle_number?: string;
}

/* ========= Inputs ========= */

export interface ImageInput {
    name: string;
    type: string;
}

export interface BagInput {
    bag_tag_no: string;
    origin?: string;
    origin_date?: string;
    destination?: string;
    destination_date?: string;
    vehicle_number?: string;
}

export interface TrackedBagInput {
    bag_tag_no: string;
    journey: string;
    status: string;
    location?: string;
    origin: string;
    origin_date: string;
    destination: string;
    destination_date: string;
    vehicle_number?: string;
    last_updated: string;
    damaged?: boolean;
    images?: ImageInput[];
    gha?: string;
    updated_by: string;
    additional_data?: string; // AWSJSON
}

export interface BagImageInput {
    bag_tag_no: string;
    journey: string;
    origin: string;
    origin_date: string;
    destination: string;
    destination_date: string;
    name: string;
    type: string;
}

/* ========= Variables ========= */

export interface GraphQLVariables extends Record<string, unknown> {
    journey: string;
    status: string;
    bags: BagInput[];
    required_inputs: string;
}

/* ========= Result Wrappers ========= */

export type SampleBagsResult = GraphQLResult<{
    getTenBags: Bag[];
}>;

export interface BagTrackingResult {
    bag_id: string;
    journey: string;
    status: string;
}

export type MutationResult = GraphQLResult<{
    saveTrackingPointForMultipleBags?: TrackingPoint[];
}>;

export type NewBag = Bag;

/* Journey Config Query */
export type JourneyConfigResult = GraphQLResult<{
    getJourneyConfig: JourneyConfig;
}>;

/* Tracking / Bag Queries */
export type TrackingPointByIdResult = GraphQLResult<{
    getTrackingPointById: TrackingPoint;
}>;

export type TrackingPointsByBagTagNoResult = GraphQLResult<{
    getTrackingPointsByBagTagNo: TrackingPoint[];
}>;

export type TrackedBagsByDateResult = GraphQLResult<{
    getTrackedBagsByDate: TrackedBag[];
}>;

export type TrackedBagsResult = GraphQLResult<{
    getTrackedBags: TrackedBag[];
}>;

export type TrackedBagsByBagTagNoResult = GraphQLResult<{
    getTrackedBagsByBagTagNo: TrackedBag[];
}>;

export type TrackedBagByBagTagNoResult = GraphQLResult<{
    getTrackedBagByBagTagNo: TrackedBag;
}>;

export type VehicleResult = GraphQLResult<{
    getVehicle: Vehicle[];
}>;

export type MenuItemsResult = GraphQLResult<{
    getMenuItems: MenuItem[];
}>;

/* Mutations */
export type StartTrackingPointJourneyResult = GraphQLResult<{
    startTrackingPointJourney: TrackingPoint;
}>;

export type GenerateBagIdResult = GraphQLResult<{
    generateBagId: TrackingPoint;
}>;

export type SaveTrackingPointResult = GraphQLResult<{
    saveTrackingPoint: TrackingPoint;
}>;

export type RevertTrackingPointResult = GraphQLResult<{
    revertTrackingPoint: TrackingPoint;
}>;

export type MassUpdateTrackingPointStatusResult = GraphQLResult<{
    massUpdateTrackingPointStatus: TrackingPoint[];
}>;

export type UpdateTrackingPointStatusRemovedResult = GraphQLResult<{
    updateTrackingPointStatusRemoved: TrackingPoint;
}>;

export type SaveBagImagesResult = GraphQLResult<{
    saveBagImages: BagImage[];
}>;

export type SaveVehicleResult = GraphQLResult<{
    saveVehicle: Vehicle;
}>;

export type SaveTrackingPointsForBagsOnVehicleResult = GraphQLResult<{
    saveTrackingPointsForBagsOnVehicle: TrackingPoint[];
}>;

export type UpdateTrackedBagResult = GraphQLResult<{
    updateTrackedBag: TrackedBag;
}>;

export type ReportDamageBagResult = GraphQLResult<{
    reportDamageBag: TrackingPoint;
}>;

export type ContainerSheetsResult = GraphQLResult<{
    getContainerSheetsByOriginDestination: ContainerSheet[];
}>;

export type CreateContainerSheetResult = GraphQLResult<{
    createContainerSheet: ContainerSheet;
}>;

export type PairContainerSheetResult = GraphQLResult<{
    pairContainerSheet: ContainerSheet;
}>;

export type TrackedBagsInformationResult = GraphQLResult<{
    getTrackedBagsInformationByDate: TrackedBagsInformation;
}>;
