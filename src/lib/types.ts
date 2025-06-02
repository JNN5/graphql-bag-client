export interface BagTrackingData {
  bagTagNumber: string;
  flightId: string;
  cruiseNumber: string;
  journey?: string;
  status?: string;
}

export interface BagInput {
  bag_tag_no: string;
  flight_id: string;
}

export interface GraphQLVariables {
  journey: string;
  status: string;
  bags: BagInput[];
  required_inputs: string;
}

export interface BagTrackingResult {
  bag_id: string;
  journey: string;
  status: string;
}

export interface MutationResult {
  data?: {
    saveTrackingPointForMultipleBags?: BagTrackingResult[];
  };
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, any>;
  }>;
}

export interface MessageHistoryFormat {
  ts: string;
  message: string;
  message_type: string;
  bag_status: string;
}

export interface LastUserUpdateTS {
  timestamp: string;
  userId: string;
}

export interface NewBag {
  flight_no: string;
  scheduled_date: string;
  bag_tag_no: string;
  bag_tag_last_five: string;
  bag_status: string;
  bag_journey: string;
  last_process_ts: string;
  last_user_update_ts: LastUserUpdateTS;
  container_sheet_id: string;
  cargo_hold_number: string;
  is_gatebag: string;
  cargo_hold: string;
  comment: string[];
  message_history: MessageHistoryFormat[];
  mast_bpm_history: string[];
  loading_sequence: string;
  bt_number: string;
}

export interface SampleBagsResult {
  data?: {
    getTenBags?: NewBag[];
  };
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, any>;
  }>;
}