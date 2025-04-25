import { BookMarked, BookOpen } from "lucide-react";

export function RecentActivities() {
  // Contoh data aktivitas terbaru
  const activities = [
    {
      id: 1,
      type: "loan",
      member: "John Doe",
      book: "Pemrograman Web",
      time: "2 jam yang lalu",
    },
    {
      id: 2,
      type: "return",
      member: "Jane Smith",
      book: "Database Design",
      time: "3 jam yang lalu",
    },
    {
      id: 3,
      type: "loan",
      member: "Robert Johnson",
      book: "Artificial Intelligence",
      time: "5 jam yang lalu",
    },
    {
      id: 4,
      type: "return",
      member: "Emily Davis",
      book: "Data Structures",
      time: "1 hari yang lalu",
    },
    {
      id: 5,
      type: "loan",
      member: "Michael Brown",
      book: "Machine Learning",
      time: "1 hari yang lalu",
    },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-4 rounded-lg border p-3"
        >
          <div
            className={`rounded-full p-2 ${
              activity.type === "loan"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            }`}
          >
            {activity.type === "loan" ? (
              <BookMarked className="h-4 w-4" />
            ) : (
              <BookOpen className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.type === "loan"
                ? "Peminjaman Buku"
                : "Pengembalian Buku"}
            </p>
            <p className="text-xs text-muted-foreground">
              Anggota: {activity.member} • Buku: {activity.book}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">{activity.time}</div>
        </div>
      ))}
    </div>
  );
}
