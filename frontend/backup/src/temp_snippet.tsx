              </div>
            )}
            {selectedMemberForAllocation && monthlyAllocations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mb-3 opacity-50" />
                <p>투입 시작일과 종료일을 선택하면</p>
                <p>월별 투입 현황이 표시됩니다.</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => setIsMonthlyAllocationDialogOpen(false)}>
              {isEditMode ? '취소' : '닫기'}
            </Button>
            {isEditMode && monthlyAllocations.length > 0 && (
              <Button onClick={() => {
                if (selectedMemberForAllocation && monthlyAllocations.length > 0) {
                  // 평균 투입률 계산
                  const averageAllocation = Math.round(
                    monthlyAllocations.reduce((sum, data) => sum + data.allocation, 0) / monthlyAllocations.length
                  );
                  
                  // 부모창의 teamMembers 업데이트 (날짜 정보도 함께 업데이트)
                  setTeamMembers(teamMembers.map(member => 
                    member.id === selectedMemberForAllocation.id
                      ? { 
                          ...member, 
                          allocation: averageAllocation,
                          startDate: memberStartDate,
                          endDate: memberEndDate
                        }
                      : member
                  ));
                  
                  alert(`월별 투입 현황이 저장되었습니다.\n평균 투입률: ${averageAllocation}%`);
                  setIsMonthlyAllocationDialogOpen(false);
                }
              }}>
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            )}
          </DialogFooter>
