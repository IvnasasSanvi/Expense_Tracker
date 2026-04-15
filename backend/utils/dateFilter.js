const getDateRange = (range) => {
  const now = new Date();
  let start;

  switch (range) {
    case "daily":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "weekly":
      const temp = new Date(now); // clone
      const firstDayOfWeek = temp.getDate() - temp.getDay();
      start = new Date(temp.setDate(firstDayOfWeek));
      break;
    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "yearly":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case "all":
      start = new Date(0); // from 1970
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1); // default monthly
  }

  return { start, end: new Date() };
};

export default getDateRange