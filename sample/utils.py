from collections import OrderedDict

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class PageSizeNumberPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('page_size', self.page_size),
            ('num_pages', self.page.paginator.num_pages),
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('current_page_number', self.page.number),
            ('next_page_number', self.page.next_page_number() if self.page.has_next() else None),
            ('previous_page_number', self.page.previous_page_number() if self.page.has_previous() else None),
            ('results', data)
        ]))
