"use client";

import { UserData } from "@/types/userData";
import UserId from "./UserId";
import Person from "./Person";
import Age from "./Age";
import Email from "./Email";
import Phone from "./Phone";
import Role from "./Role";
import Register from "./Register";

interface TableRowProps {
  user: UserData;
}

const TableRow = ({ user }: TableRowProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-2 px-3 py-1 duration-300 hover:bg-gray-50 hover:shadow-lg rounded">
      <UserId userId={user.id} />
      <Person
        name={user.name}
        surname={user.surname}
        birthday={user.birthdayDate}
      />
      <Age birthdayDate={user.birthdayDate} />
      <Email email={user.email} emailVerified={user.emailVerified} />
      <Phone
        phone={user.phoneNumber}
        phoneVerified={user.phoneNumberVerified}
      />
      <Role initialRole={user.role} userId={user.id} />
      <Register createdAt={user.createdAt} />
    </div>
  );
};

export default TableRow;
