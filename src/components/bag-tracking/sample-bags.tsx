import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Loader2, Package, Clock, User, MessageSquare, Tag } from 'lucide-react';
import Barcode from 'react-barcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useApiSetup } from '@/contexts/api-setup-context';
import { fetchSampleBags } from '@/lib/graphql';
import { Bag } from '@/lib/types';

const SampleBags = () => {
  const { apiUrl, apiKey } = useApiSetup();
  const [bags, setBags] = useState<Bag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSampleBags = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchSampleBags(apiUrl, apiKey);
      if (result.data?.getTenBags) {
        setBags(result.data.getTenBags);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sample bags');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <span>Sample Bags</span>
        </CardTitle>
        <CardDescription>
          Load and view sample bag tracking data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={loadSampleBags}
          className="w-full mb-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading Samples...
            </>
          ) : (
            'Load Sample Bags'
          )}
        </Button>

        {error && (
          <div className="text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {bags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <ScrollArea className="h-[600px] rounded-md border p-4">
                {bags.map((bag, index) => (
                  <motion.div
                    key={bag.bag_tag_no}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-4 last:mb-0"
                  >
                    <Card>
                      <CardContent className="pt-6">
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              <span className="font-semibold">{bag.bag_tag_no}</span>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                bag.bag_status === 'EXPECTED'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              }
                            >
                              {bag.bag_status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Flight ID:</span>
                              <p className="font-medium">{`${bag.scheduled_date}_${bag.flight_no}`}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Journey:</span>
                              <p className="font-medium">{bag.bag_journey}</p>
                            </div>
                            <div className="col-span-2">
                              <div className="flex justify-center bg-white p-2 rounded-md">
                                <Barcode 
                                  value={bag.bag_tag_no} 
                                  width={3}
                                  height={80}
                                  fontSize={12}
                                  margin={5}
                                  displayValue={true}
                                />
                              </div>
                            </div>
                          </div>

                          {bag.message_history && bag.message_history.length > 0 && (
                            <div className="mt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="h-4 w-4" />
                                <span className="font-medium">Message History</span>
                              </div>
                              <ScrollArea className="h-[100px] w-full rounded-md border p-2">
                                {bag.message_history?.map((msg, idx) => (
                                  <div key={idx} className="mb-2 last:mb-0 text-sm">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-muted-foreground">{formatDate(msg.ts)}</span>
                                    </div>
                                    <p className="ml-5">{msg.message}</p>
                                  </div>
                                ))}
                              </ScrollArea>
                            </div>
                          )}

                          {bag.last_user_update_ts && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                              <User className="h-3 w-3" />
                              <span>
                                Last updated by {bag.last_user_update_ts.userId} at{' '}
                                {formatDate(bag.last_user_update_ts.timestamp)}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default SampleBags;