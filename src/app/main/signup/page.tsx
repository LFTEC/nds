import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { SearchInput } from "@/ui/search-box";
import { getUserList } from "@/services/userService";
import { getUserPages } from "@/services/userService";
import { PaginationBox } from "@/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserButton, PasswordButton } from "@/ui/signup/user-button";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: number }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";
  const currentPage = params?.page || 1;

  const pages = await getUserPages(query);
  const users = await getUserList(query, currentPage);

  return (
    <div className="flex grow gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <Card className="h-full flex-1 rounded-sm">
        <CardHeader>
          <CardTitle>检验员管理</CardTitle>
          <CardDescription>
            新增、修改检验员信息，修改密码。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="border-b" />
          <div className="flex gap-4 mx-2 my-2">
            <SearchInput placeholder="查询用户信息" />
            {/* <EditNori behavior="create" /> */}
            <UserButton behavior="create" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户名</TableHead>
                <TableHead>姓名</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user=>(
                <TableRow key={user.username}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><div className="flex items-center gap-2"><UserButton behavior="edit" /><PasswordButton/> </div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationBox totalPages={pages} />
        </CardContent>
      </Card>
    </div>
  );
}
