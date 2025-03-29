import * as React from "react";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "@/components/navbar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/components/ui/dropdown";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "@/components/ui/sidebar";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
import {
  BarcodeIcon,
  ChevronUpIcon,
  UsersIcon,
  UserRoundCogIcon,
  NotebookTextIcon,
  PanelTopIcon,
  ReceiptTextIcon,
  StarIcon,
  SquareStackIcon,
  TicketIcon, CoinsIcon, HandCoinsIcon, SmilePlusIcon, TicketsIcon,
} from "lucide-react";

import UserContext from "./contexts/user-context.ts";

export default function Layout({ children }) {
  const currentUser = React.use(UserContext);
  return (
    <SidebarLayout
      sidebar={
        <Sidebar>
          <SidebarBody>
            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>상품관련</SidebarHeading>
              <SidebarItem to="/product-categories">
                <SquareStackIcon />
                <SidebarLabel>상품 카테고리</SidebarLabel>
              </SidebarItem>
              <SidebarItem to="/products">
                <BarcodeIcon />
                <SidebarLabel>상품</SidebarLabel>
              </SidebarItem>
              <SidebarItem to="/reviews">
                <StarIcon />
                <SidebarLabel>리뷰</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>주문</SidebarHeading>
              <SidebarItem to="/orders">
                <ReceiptTextIcon />
                <SidebarLabel>주문</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>홈페이지</SidebarHeading>
              <SidebarItem to="">
                <PanelTopIcon />
                <SidebarLabel>배너 관리</SidebarLabel>
              </SidebarItem>
              <SidebarItem to="">
                <NotebookTextIcon />
                <SidebarLabel>프로모션 페이지</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>혜택</SidebarHeading>
              <SidebarItem to="/coupons">
                <TicketIcon />
                <SidebarLabel>쿠폰</SidebarLabel>
              </SidebarItem>

              <SidebarItem to="/user-coupons">
                <TicketsIcon />
                <SidebarLabel>쿠폰 발급 현황</SidebarLabel>
              </SidebarItem>

              <SidebarItem to="/points">
                <SmilePlusIcon />
                <SidebarLabel>적립금</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>유저</SidebarHeading>
              <SidebarItem to="/users">
                <UsersIcon />
                <SidebarLabel>사용자</SidebarLabel>
              </SidebarItem>

              <SidebarItem to="/admin-users">
                <UserRoundCogIcon />
                <SidebarLabel>관리자</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <div className="grow flex min-w-0 items-center gap-3">
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      {currentUser.name}
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {currentUser.username}
                    </span>
                  </span>
                </div>
                <ChevronUpIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="top start">
                <DropdownItem to="/my-profile">
                  {/*<UserIcon />*/}
                  <DropdownLabel>정보수정</DropdownLabel>
                </DropdownItem>
                <DropdownItem to="/my-profile">
                  {/*<UserIcon />*/}
                  <DropdownLabel>로그아웃</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
