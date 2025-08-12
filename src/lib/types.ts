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

// Enums
export enum VehicleAction {
  LOADING = "LOADING",
  UNLOADING = "UNLOADING",
  KEEPING = "KEEPING",
}

// Base types from schema
export interface JourneyUI {
  icon?: string;
  color?: string;
  text_color?: string;
  button_text?: string;
  category_text?: string;
}

export interface JourneyFlow {
  next_tracking_points?: string[];
  is_initial: boolean;
  vehicle_action?: VehicleAction;
  no_of_images?: number;
}

export interface TrackingPointConfig {
  journey?: string;
  status?: string;
  category?: string;
  menu_item?: string;
  next_tracking_points?: string[];
  required_inputs?: string; // AWSJSON
  is_initial_state: boolean;
  cognito_group?: string;
  ui?: JourneyUI;
}

export interface TrackingPoint {
  bag_tag_no: string;
  tracking_point_id: string;
  journey: string;
  status: string;
  location?: string;
  bpm: string;
  timestamp: string;
  reverted: boolean;
  origin?: string;
  destination?: string;
  vehicle_action?: string;
  vehicle_number?: string;
  tracked_by?: string;
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
  destination: string;
  vehicle_number?: string;
  additional_data?: string; // AWSJSON
  bag_images?: BagImage[];
}

export interface Vehicle {
  vehicle_number?: string;
  journey?: string;
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
  bag_tag_last_five: string;
  bag_status: string;
  bag_journey: string;
  last_process_ts: string;
  last_user_update_ts?: LastUserUpdateTS;
  container_sheet_id?: string;
  cargo_hold_number?: string;
  is_gatebag?: string;
  cargo_hold?: string;
  comment?: string[];
  message_history?: MessageHistoryFormat[];
  mast_bpm_history?: string[];
  loading_sequence?: string;
  bt_number?: string;
}

// Legacy interfaces for backward compatibility
export interface BagTrackingData {
  bagTagNumber: string;
  flightId: string; // Used as origin in new schema
  cruiseNumber: string; // Used as destination in new schema
  journey?: string;
  status?: string;
  origin?: string; // New field from schema
  destination?: string; // New field from schema
  vehicle_number?: string; // New field from schema
}

// Input types
export interface BagInput {
  bag_tag_no: string;
  origin: string;
  destination: string;
  vehicle_number?: string;
}

export interface TrackedBagInput {
  bag_tag_no: string;
  journey: string;
  status: string;
  location?: string;
  origin: string;
  destination: string;
  vehicle_number?: string;
  last_updated: string;
  updated_by?: string;
  additional_data?: string; // AWSJSON
}

export interface BagImageInput {
  bag_tag_no: string;
  journey: string;
  origin: string;
  destination: string;
  name: string;
  type: string;
}

// Variables for mutations
export interface GraphQLVariables extends Record<string, unknown> {
  journey: string;
  status: string;
  bags: BagInput[];
  required_inputs: string;
}

// Query result interfaces
export type SampleBagsResult = GraphQLResult<{
  getTenBags: Bag[];
}>;

// Legacy types for compatibility
export interface BagTrackingResult {
  bag_id: string;
  journey: string;
  status: string;
}

export type MutationResult = GraphQLResult<{
  saveTrackingPointForMultipleBags?: TrackingPoint[];
}>;

// For backward compatibility
export type NewBag = Bag;

// Additional query result types
export type TrackingPointsConfigResult = GraphQLResult<{
  getTrackingPointsConfig: TrackingPointConfig[];
}>;

export type TrackingPointsConfigByJourneyResult = GraphQLResult<{
  getTrackingPointsConfigByJourney: TrackingPointConfig[];
}>;

export type TrackingPointsConfigByCategoryResult = GraphQLResult<{
  getTrackingPointsConfigByCategory: TrackingPointConfig[];
}>;

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

export type VehicleResult = GraphQLResult<{
  getVehicle: Vehicle[];
}>;

export type MenuItemsResult = GraphQLResult<{
  getMenuItems: MenuItem[];
}>;

// Mutation result types
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
