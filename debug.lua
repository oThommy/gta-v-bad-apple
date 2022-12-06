RegisterCommand('dimensions', function(_, args)
    local playerPed = PlayerPedId()
    local playerPos = GetEntityCoords(playerPed)
    local limit = 3.0
    local dimension = args[1] or 'height'
    local model = args[2] or 'panto'
    local defaultOffset = args[3] or 0.0
    local fivemAngle = 240.0
    local radAngle = convertToRad(fivemAngle)
    local loc = {
        ['x'] = -1880.5393066406,
        ['y'] = 2964.6267089844,
        ['z'] = 32.810276031494
    }
    local veh

    if (getDistance(playerPos.x, playerPos.y, playerPos.z, loc.x, loc.y, loc.z) > 50) then -- tp player to location if the player is further than 50 meters away from the location
        SetEntityCoordsNoOffset(playerPed, loc.x, loc.y, loc.z)
    end

    if (dimension == 'height') then
        _LoadModel(model)
        veh = CreateVehicle(model, playerPos.x, playerPos.y, playerPos.z, 0.0, true, false)
        FreezeEntityPosition(veh, true)
        SetVehicleCustomPrimaryColour(veh, 255, 255, 255)
        SetVehicleCustomSecondaryColour(veh, 255, 255, 255)
        SetEntityInvincible(veh, true)
        SetModelAsNoLongerNeeded(model)
    
        local vehPos = GetEntityCoords(veh)
        msg(vehPos.x, vehPos.y, vehPos.z)
        SetEntityCoordsNoOffset(veh, vehPos.x, vehPos.y, vehPos.z - defaultOffset) -- default offset
        local vehPos = GetEntityCoords(veh)

        for i = 0, limit, 0.001 do
            Wait(100)
            print(i + defaultOffset)
            SetEntityCoordsNoOffset(veh, vehPos.x, vehPos.y, vehPos.z - i)
        end
    elseif (dimension == 'depth') then
        _LoadModel(model)
        veh = CreateVehicle(model, -1876.25980762113533, 2968.15, 32.1373, fivemAngle, true, false)
        FreezeEntityPosition(veh, true)
        SetVehicleCustomPrimaryColour(veh, 255, 255, 255)
        SetVehicleCustomSecondaryColour(veh, 255, 255, 255)
        SetEntityInvincible(veh, true)
        SetModelAsNoLongerNeeded(model)
    
        local vehPos = GetEntityCoords(veh)
        SetEntityCoordsNoOffset(veh, vehPos.x + defaultOffset * math.cos(radAngle), vehPos.y + defaultOffset * math.sin(radAngle), vehPos.z) -- default offset
        local vehPos = GetEntityCoords(veh)

        for i = 0, limit, 0.01 do
            Wait(100)
            print(i + defaultOffset)
            SetEntityCoordsNoOffset(veh, vehPos.x + i * math.cos(radAngle), vehPos.y + i * math.sin(radAngle), vehPos.z)
        end
    elseif (dimension == 'width') then
        _LoadModel(model)
        veh = CreateVehicle(model, -1875.69342700706031, 2967.823, 32.1373, fivemAngle + 90.0, true, false) -- turn 90 degrees to the left
        FreezeEntityPosition(veh, true)
        SetVehicleCustomPrimaryColour(veh, 255, 255, 255)
        SetVehicleCustomSecondaryColour(veh, 255, 255, 255)
        SetEntityInvincible(veh, true)
        SetModelAsNoLongerNeeded(model)
    
        local vehPos = GetEntityCoords(veh)
        SetEntityCoordsNoOffset(veh, vehPos.x + defaultOffset * math.cos(radAngle), vehPos.y + defaultOffset * math.sin(radAngle), vehPos.z) -- default offset
        local vehPos = GetEntityCoords(veh)

        for i = 0, limit, 0.01 do
            Wait(100)
            print(i + defaultOffset)
            SetEntityCoordsNoOffset(veh, vehPos.x + i * math.cos(radAngle), vehPos.y + i * math.sin(radAngle), vehPos.z)
        end
    end

    Wait(1200)
    DeleteEntity(veh)
end, false)

RegisterCommand('north', function()
    local playerPed = PlayerPedId()
    SetEntityHeading(playerPed, 0.0)
end, false)

RegisterCommand('coords', function()
    local playerPed = PlayerPedId()
    local playerPos = GetEntityCoords(playerPed)
    local coordsMsg = 'x: ' .. playerPos.x .. ' y: ' .. playerPos.y .. ' z: ' .. playerPos.z
    msg(coordsMsg)
end, false)

RegisterCommand('heading', function()
    local playerPed = PlayerPedId()
    local limit = 20

    for i = 1, limit do
        Wait(500)
        local heading = GetEntityHeading(playerPed)
        msg(heading)
    end
end, false)

RegisterCommand('test', function()
end, false)

addSuggestion('dimensions', 'dimension (height / width / depth)', 'model', 'defaultOffset')