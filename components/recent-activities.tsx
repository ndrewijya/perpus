type Activity = {
  id: string;
  member: { name: string };
  loanItems: { book: { title: string } }[];
  createdAt: Date;
};

export function RecentActivities({ activities }: { activities: Activity[] }) {
  if (!activities || activities.length === 0) {
    return <div>Belum ada aktivitas.</div>;
  }
  return (
    <ul>
      {activities.map((activity) => (
        <li key={activity.id}>
          {activity.member.name} meminjam{" "}
          {activity.loanItems.map((li) => li.book.title).join(", ")}
        </li>
      ))}
    </ul>
  );
}
