import React from "react";
import { hasAnyPermission } from "../../utilits/auth";
import NotAuthorized from "../pages/NotAuthorized";

export default function RequirePermission({ anyOf, children, fallback = null }) {
  const allowed = hasAnyPermission(anyOf);

  if (!allowed) {
    return fallback ?? <NotAuthorized />;
  }

  return children;
}

