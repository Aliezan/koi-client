import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  GetNotificationResponse,
  NotificationStatus,
} from "@/types/notificationTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const markNotificationAsRead = async (
  token: string,
  notificationId: string,
) => {
  await fetchWithAuth.post(
    `/notifications/read/${notificationId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const useMarkNotificationAsRead = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(token, notificationId),
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData<GetNotificationResponse>(
        ["notifications"],
        (oldData) => {
          if (!oldData) return { data: [], count: 0, page: 1, limit: 10 };
          return {
            ...oldData,
            data: oldData.data.map((notification) =>
              notification.notification_id === notificationId
                ? { ...notification, status: "READ" as NotificationStatus }
                : notification,
            ),
          };
        },
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};
