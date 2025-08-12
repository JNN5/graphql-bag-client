import { GraphQLVariables, MutationResult, SampleBagsResult } from "./types";

// Query definitions
const QUERY_SAMPLE_BAGS = `
  query {
    getTenBags {
      flight_no
      scheduled_date
      bag_tag_no
      bag_status
      bag_journey
      bag_tag_last_five
      last_process_ts
    }
  }
`;

const QUERY_TRACKING_POINTS_CONFIG = `
  query {
    getTrackingPointsConfig {
      journey
      status
      category
      menu_item
      next_tracking_points
      required_inputs
      is_initial_state
      cognito_group
      ui {
        icon
        color
        text_color
        button_text
        category_text
      }
    }
  }
`;

const QUERY_TRACKING_POINTS_CONFIG_BY_JOURNEY = `
  query getTrackingPointsConfigByJourney($journey: String!) {
    getTrackingPointsConfigByJourney(journey: $journey) {
      journey
      status
      category
      menu_item
      next_tracking_points
      required_inputs
      is_initial_state
      cognito_group
      ui {
        icon
        color
        text_color
        button_text
        category_text
      }
    }
  }
`;

const QUERY_TRACKING_POINTS_CONFIG_BY_CATEGORY = `
  query getTrackingPointsConfigByCategory($category: String!) {
    getTrackingPointsConfigByCategory(category: $category) {
      journey
      status
      category
      menu_item
      next_tracking_points
      required_inputs
      is_initial_state
      cognito_group
      ui {
        icon
        color
        text_color
        button_text
        category_text
      }
    }
  }
`;

const QUERY_TRACKING_POINT_BY_ID = `
  query getTrackingPointById($bag_tag_no: String!, $tracking_point_id: String!) {
    getTrackingPointById(bag_tag_no: $bag_tag_no, tracking_point_id: $tracking_point_id) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      destination
      vehicle_action
      vehicle_number
      tracked_by
      additional_data
    }
  }
`;

const QUERY_TRACKING_POINTS_BY_BAG_TAG_NO = `
  query getTrackingPointsByBagTagNo($bag_tag_no: String!, $journey: String!, $origin: String!, $destination: String!) {
    getTrackingPointsByBagTagNo(bag_tag_no: $bag_tag_no, journey: $journey, origin: $origin, destination: $destination) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      destination
      vehicle_action
      vehicle_number
      tracked_by
      additional_data
    }
  }
`;

const QUERY_TRACKED_BAGS_BY_DATE = `
  query getTrackedBagsByDate($journey: String!, $date: String!) {
    getTrackedBagsByDate(journey: $journey, date: $date) {
      bag_tag_no
      journey
      status
      location
      updated_by
      last_updated
      origin
      destination
      vehicle_number
      additional_data
      bag_images {
        name
        url
        type
      }
    }
  }
`;

const QUERY_TRACKED_BAGS = `
  query getTrackedBags($journey: String!, $bags: [BagInput!]) {
    getTrackedBags(journey: $journey, bags: $bags) {
      bag_tag_no
      journey
      status
      location
      updated_by
      last_updated
      origin
      destination
      vehicle_number
      additional_data
      bag_images {
        name
        url
        type
      }
    }
  }
`;

const QUERY_TRACKED_BAGS_BY_BAG_TAG_NO = `
  query getTrackedBagsByBagTagNo($bag_tag_no: String!, $journey: String!) {
    getTrackedBagsByBagTagNo(bag_tag_no: $bag_tag_no, journey: $journey) {
      bag_tag_no
      journey
      status
      location
      updated_by
      last_updated
      origin
      destination
      vehicle_number
      additional_data
      bag_images {
        name
        url
        type
      }
    }
  }
`;

const QUERY_VEHICLE = `
  query getVehicle($journey: String) {
    getVehicle(journey: $journey) {
      vehicle_number
      journey
    }
  }
`;

const QUERY_MENU_ITEMS = `
  query {
    getMenuItems {
      journey
      status
      category
      menu_item
      cognito_group
      ui {
        icon
        color
        text_color
        button_text
        category_text
      }
      flow {
        next_tracking_points
        is_initial
        vehicle_action
        no_of_images
      }
    }
  }
`;

// Mutation definitions
const MUTATION_START_TRACKING_POINT_JOURNEY = `
  mutation startTrackingPointJourney(
    $bag_tag_no: String!,
    $journey: String!,
    $status: String!,
    $origin: String!,
    $destination: String!,
    $required_inputs: AWSJSON
  ) {
    startTrackingPointJourney(
      bag_tag_no: $bag_tag_no,
      journey: $journey,
      status: $status,
      origin: $origin,
      destination: $destination,
      required_inputs: $required_inputs
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      destination
      vehicle_action
      vehicle_number
      tracked_by
      additional_data
    }
  }
`;

const MUTATION_GENERATE_BAG_ID = `
  mutation generateBagId(
    $journey: String!,
    $status: String!,
    $required_inputs: AWSJSON
  ) {
    generateBagId(
      journey: $journey,
      status: $status,
      required_inputs: $required_inputs
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      destination
      vehicle_action
      vehicle_number
      tracked_by
      additional_data
    }
  }
`;

const MUTATION_SAVE_TRACKING_POINT = `
  mutation saveTrackingPoint(
    $journey: String!,
    $status: String!,
    $bag_tag_no: String!,
    $origin: String,
    $destination: String,
    $vehicle_number: String,
    $required_inputs: AWSJSON
  ) {
    saveTrackingPoint(
      journey: $journey,
      status: $status,
      bag_tag_no: $bag_tag_no,
      origin: $origin,
      destination: $destination,
      vehicle_number: $vehicle_number,
      required_inputs: $required_inputs
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      destination
      vehicle_action
      vehicle_number
      tracked_by
      additional_data
    }
  }
`;

const MUTATION_SAVE_TRACKING_POINT_FOR_MULTIPLE_BAGS = `
  mutation saveTrackingPointForMultipleBags(
    $journey: String!, 
    $status: String!, 
    $bags: [BagInput!], 
    $required_inputs: AWSJSON
  ) {
    saveTrackingPointForMultipleBags(
      journey: $journey,
      status: $status, 
      bags: $bags, 
      required_inputs: $required_inputs
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      destination
      vehicle_action
      vehicle_number
      tracked_by
      additional_data
    }
  }
`;

const MUTATION_REVERT_TRACKING_POINT = `
  mutation revertTrackingPoint(
    $bag_tag_no: String!,
    $tracking_point_id: String!
  ) {
    revertTrackingPoint(
      bag_tag_no: $bag_tag_no,
      tracking_point_id: $tracking_point_id
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      destination
      vehicle_action
      vehicle_number
      tracked_by
      additional_data
    }
  }
`;

const MUTATION_MASS_UPDATE_TRACKING_POINT_STATUS = `
  mutation massUpdateTrackingPointStatus(
    $journey: String!,
    $status: String!,
    $new_status: String!
  ) {
    massUpdateTrackingPointStatus(
      journey: $journey,
      status: $status,
      new_status: $new_status
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      destination
      vehicle_action
      vehicle_number
      tracked_by
      additional_data
    }
  }
`;

const MUTATION_UPDATE_TRACKING_POINT_STATUS_REMOVED = `
  mutation updateTrackingPointStatusRemoved(
    $bag_tag_no: String!,
    $journey: String!,
    $origin: String,
    $destination: String
  ) {
    updateTrackingPointStatusRemoved(
      bag_tag_no: $bag_tag_no,
      journey: $journey,
      origin: $origin,
      destination: $destination
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      destination
      vehicle_action
      vehicle_number
      tracked_by
      additional_data
    }
  }
`;

const MUTATION_SAVE_BAG_IMAGES = `
  mutation saveBagImages($bag_images: [BagImageInput!]) {
    saveBagImages(bag_images: $bag_images) {
      name
      url
      type
    }
  }
`;

const MUTATION_SAVE_VEHICLE = `
  mutation saveVehicle($vehicle_number: String!, $journey: String) {
    saveVehicle(vehicle_number: $vehicle_number, journey: $journey) {
      vehicle_number
      journey
    }
  }
`;

const MUTATION_SAVE_TRACKING_POINTS_FOR_BAGS_ON_VEHICLE = `
  mutation saveTrackingPointsForBagsOnVehicle(
    $vehicle_number: String!,
    $journey: String!,
    $status: String!
  ) {
    saveTrackingPointsForBagsOnVehicle(
      vehicle_number: $vehicle_number,
      journey: $journey,
      status: $status
    ) {
      bag_tag_no
      tracking_point_id
      journey
      status
      location
      bpm
      timestamp
      reverted
      origin
      destination
      vehicle_action
      vehicle_number
      tracked_by
      additional_data
    }
  }
`;

const MUTATION_UPDATE_TRACKED_BAG = `
  mutation updateTrackedBag($bag: TrackedBagInput!) {
    updateTrackedBag(bag: $bag) {
      bag_tag_no
      journey
      status
      location
      updated_by
      last_updated
      origin
      destination
      vehicle_number
      additional_data
      bag_images {
        name
        url
        type
      }
    }
  }
`;

// const QUERY_SAMPLE_BAGS = `
//   query {
//     getTenBags {
//       flight_no
//       scheduled_date
//       bag_tag_no
//       bag_tag_last_five
//       bag_status
//       bag_journey
//       last_process_ts
//       last_user_update_ts {
//         timestamp
//         userId
//       }
//       container_sheet_id
//       cargo_hold_number
//       is_gatebag
//       cargo_hold
//       comment
//       message_history {
//         ts
//         message
//         message_type
//         bag_status
//       }
//       mast_bpm_history
//       loading_sequence
//       bt_number
//     }
//   }
// `;

/**
 * Generic GraphQL request function
 * This is the core function that handles all GraphQL API requests
 *
 * @param endpoint - The GraphQL API endpoint URL
 * @param apiKey - The API key for authentication
 * @param query - The GraphQL query or mutation string
 * @param variables - Optional variables for the GraphQL operation
 * @returns Promise with the typed result
 */
async function executeGraphQLRequest<T>(
  endpoint: string,
  apiKey: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message);
    }

    return result as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}

// Legacy function for backward compatibility
export async function executeGraphQLMutation(
  endpoint: string,
  apiKey: string,
  variables: GraphQLVariables
): Promise<MutationResult> {
  return executeGraphQLRequest<MutationResult>(
    endpoint,
    apiKey,
    MUTATION_SAVE_TRACKING_POINT_FOR_MULTIPLE_BAGS,
    variables
  );
}

// Legacy function for backward compatibility
export async function fetchSampleBags(
  endpoint: string,
  apiKey: string
): Promise<SampleBagsResult> {
  return executeGraphQLRequest<SampleBagsResult>(
    endpoint,
    apiKey,
    QUERY_SAMPLE_BAGS
  );
}

// Legacy function for backward compatibility
export async function executeGraphQLQuery(
  apiUrl: string,
  apiKey: string,
  query: string,
  variables?: Record<string, unknown>
) {
  return executeGraphQLRequest(apiUrl, apiKey, query, variables);
}

// Query functions
export function getTrackingPointsConfig(endpoint: string, apiKey: string) {
  return executeGraphQLRequest(endpoint, apiKey, QUERY_TRACKING_POINTS_CONFIG);
}

export function getTrackingPointsConfigByJourney(
  endpoint: string,
  apiKey: string,
  journey: string
) {
  return executeGraphQLRequest(
    endpoint,
    apiKey,
    QUERY_TRACKING_POINTS_CONFIG_BY_JOURNEY,
    { journey }
  );
}

export function getTrackingPointsConfigByCategory(
  endpoint: string,
  apiKey: string,
  category: string
) {
  return executeGraphQLRequest(
    endpoint,
    apiKey,
    QUERY_TRACKING_POINTS_CONFIG_BY_CATEGORY,
    { category }
  );
}

export function getTrackingPointById(
  endpoint: string,
  apiKey: string,
  bag_tag_no: string,
  tracking_point_id: string
) {
  return executeGraphQLRequest(endpoint, apiKey, QUERY_TRACKING_POINT_BY_ID, {
    bag_tag_no,
    tracking_point_id,
  });
}

export function getTrackingPointsByBagTagNo(
  endpoint: string,
  apiKey: string,
  bag_tag_no: string,
  journey: string,
  origin: string,
  destination: string
) {
  return executeGraphQLRequest(
    endpoint,
    apiKey,
    QUERY_TRACKING_POINTS_BY_BAG_TAG_NO,
    { bag_tag_no, journey, origin, destination }
  );
}

export function getTrackedBagsByDate(
  endpoint: string,
  apiKey: string,
  journey: string,
  date: string
) {
  return executeGraphQLRequest(endpoint, apiKey, QUERY_TRACKED_BAGS_BY_DATE, {
    journey,
    date,
  });
}

export function getTrackedBags(
  endpoint: string,
  apiKey: string,
  journey: string,
  bags: Array<{
    bag_tag_no: string;
    origin: string;
    destination: string;
    vehicle_number?: string;
  }>
) {
  return executeGraphQLRequest(endpoint, apiKey, QUERY_TRACKED_BAGS, {
    journey,
    bags,
  });
}

export function getTrackedBagsByBagTagNo(
  endpoint: string,
  apiKey: string,
  bag_tag_no: string,
  journey: string
) {
  return executeGraphQLRequest(
    endpoint,
    apiKey,
    QUERY_TRACKED_BAGS_BY_BAG_TAG_NO,
    { bag_tag_no, journey }
  );
}

export function getVehicle(endpoint: string, apiKey: string, journey?: string) {
  return executeGraphQLRequest(
    endpoint,
    apiKey,
    QUERY_VEHICLE,
    journey ? { journey } : {}
  );
}

export function getMenuItems(endpoint: string, apiKey: string) {
  return executeGraphQLRequest(endpoint, apiKey, QUERY_MENU_ITEMS);
}

// Mutation functions
export function startTrackingPointJourney(
  endpoint: string,
  apiKey: string,
  bag_tag_no: string,
  journey: string,
  status: string,
  origin: string,
  destination: string,
  required_inputs?: string
) {
  return executeGraphQLRequest(
    endpoint,
    apiKey,
    MUTATION_START_TRACKING_POINT_JOURNEY,
    { bag_tag_no, journey, status, origin, destination, required_inputs }
  );
}

export function generateBagId(
  endpoint: string,
  apiKey: string,
  journey: string,
  status: string,
  required_inputs?: string
) {
  return executeGraphQLRequest(endpoint, apiKey, MUTATION_GENERATE_BAG_ID, {
    journey,
    status,
    required_inputs,
  });
}

export function saveTrackingPoint(
  endpoint: string,
  apiKey: string,
  journey: string,
  status: string,
  bag_tag_no: string,
  origin?: string,
  destination?: string,
  vehicle_number?: string,
  required_inputs?: string
) {
  return executeGraphQLRequest(endpoint, apiKey, MUTATION_SAVE_TRACKING_POINT, {
    journey,
    status,
    bag_tag_no,
    origin,
    destination,
    vehicle_number,
    required_inputs,
  });
}

export function saveTrackingPointForMultipleBags(
  endpoint: string,
  apiKey: string,
  journey: string,
  status: string,
  bags: Array<{
    bag_tag_no: string;
    origin: string;
    destination: string;
    vehicle_number?: string;
  }>,
  required_inputs?: string
) {
  return executeGraphQLRequest(
    endpoint,
    apiKey,
    MUTATION_SAVE_TRACKING_POINT_FOR_MULTIPLE_BAGS,
    { journey, status, bags, required_inputs }
  );
}

export function revertTrackingPoint(
  endpoint: string,
  apiKey: string,
  bag_tag_no: string,
  tracking_point_id: string
) {
  return executeGraphQLRequest(
    endpoint,
    apiKey,
    MUTATION_REVERT_TRACKING_POINT,
    { bag_tag_no, tracking_point_id }
  );
}

export function massUpdateTrackingPointStatus(
  endpoint: string,
  apiKey: string,
  journey: string,
  status: string,
  new_status: string
) {
  return executeGraphQLRequest(
    endpoint,
    apiKey,
    MUTATION_MASS_UPDATE_TRACKING_POINT_STATUS,
    { journey, status, new_status }
  );
}

export function updateTrackingPointStatusRemoved(
  endpoint: string,
  apiKey: string,
  bag_tag_no: string,
  journey: string,
  origin?: string,
  destination?: string
) {
  return executeGraphQLRequest(
    endpoint,
    apiKey,
    MUTATION_UPDATE_TRACKING_POINT_STATUS_REMOVED,
    { bag_tag_no, journey, origin, destination }
  );
}

export function saveBagImages(
  endpoint: string,
  apiKey: string,
  bag_images: Array<{
    bag_tag_no: string;
    journey: string;
    origin: string;
    destination: string;
    name: string;
    type: string;
  }>
) {
  return executeGraphQLRequest(endpoint, apiKey, MUTATION_SAVE_BAG_IMAGES, {
    bag_images,
  });
}

export function saveVehicle(
  endpoint: string,
  apiKey: string,
  vehicle_number: string,
  journey?: string
) {
  return executeGraphQLRequest(endpoint, apiKey, MUTATION_SAVE_VEHICLE, {
    vehicle_number,
    journey,
  });
}

export function saveTrackingPointsForBagsOnVehicle(
  endpoint: string,
  apiKey: string,
  vehicle_number: string,
  journey: string,
  status: string
) {
  return executeGraphQLRequest(
    endpoint,
    apiKey,
    MUTATION_SAVE_TRACKING_POINTS_FOR_BAGS_ON_VEHICLE,
    { vehicle_number, journey, status }
  );
}

export function updateTrackedBag(
  endpoint: string,
  apiKey: string,
  bag: {
    bag_tag_no: string;
    journey: string;
    status: string;
    location?: string;
    origin: string;
    destination: string;
    vehicle_number?: string;
    last_updated: string;
    updated_by?: string;
    additional_data?: string;
  }
) {
  return executeGraphQLRequest(endpoint, apiKey, MUTATION_UPDATE_TRACKED_BAG, {
    bag,
  });
}
