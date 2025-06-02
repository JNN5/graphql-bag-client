import { GraphQLVariables, MutationResult, SampleBagsResult } from './types';

const MUTATION = `
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
      bag_id
      journey
      status
    }
  }
`;

const QUERY_SAMPLE_BAGS = `
  query {
    getTenBags {
      flight_no
      scheduled_date
      bag_tag_no
      bag_tag_last_five
      bag_status
      bag_journey
      last_process_ts
      last_user_update_ts {
        timestamp
        userId
      }
      container_sheet_id
      cargo_hold_number
      is_gatebag
      cargo_hold
      comment
      message_history {
        ts
        message
        message_type
        bag_status
      }
      mast_bpm_history
      loading_sequence
      bt_number
    }
  }
`;

export async function executeGraphQLMutation(
  endpoint: string,
  apiKey: string,
  variables: GraphQLVariables
): Promise<MutationResult> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': `${apiKey}`
      },
      body: JSON.stringify({
        query: MUTATION,
        variables
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
    
    return result as MutationResult;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

export async function fetchSampleBags(
  endpoint: string,
  apiKey: string
): Promise<SampleBagsResult> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': `${apiKey}`
      },
      body: JSON.stringify({
        query: QUERY_SAMPLE_BAGS
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
    
    return result as SampleBagsResult;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}